/*# -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*-
# ***** BEGIN LICENSE BLOCK *****
# Version: MPL 1.1/GPL 2.0/LGPL 2.1
#
# The contents of this file are subject to the Mozilla Public License Version
# 1.1 (the "License"); you may not use this file except in compliance with
# the License. You may obtain a copy of the License at
# http://www.mozilla.org/MPL/
#
# Software distributed under the License is distributed on an "AS IS" basis,
# WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
# for the specific language governing rights and limitations under the
# License.
#
# The Original Code is Mozilla Communicator client code, released
# March 31, 1998.
#
# The Initial Developer of the Original Code is
# Netscape Communications Corporation.
# Portions created by the Initial Developer are Copyright (C) 1998-1999
# the Initial Developer. All Rights Reserved.
#
# Contributor(s):
#   Joachim Herb <joachim.herb@gmx.de>
#
# Alternatively, the contents of this file may be used under the terms of
# either the GNU General Public License Version 2 or later (the "GPL"), or
# the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
# in which case the provisions of the GPL or the LGPL are applicable instead
# of those above. If you wish to allow use of your version of this file only
# under the terms of either the GPL or the LGPL, and not to allow others to
# use your version of this file under the terms of the MPL, indicate your
# decision by deleting the provisions above and replace them with the notice
# and other provisions required by the GPL or the LGPL. If you do not delete
# the provisions above, a recipient may use your version of this file under
# the terms of any one of the MPL, the GPL or the LGPL.
#
# ***** END LICENSE BLOCK *****
*/

if(!org) var org={};
if(!org.mozdev) org.mozdev={};
if(!org.mozdev.AutoSlide) org.mozdev.AutoSlide = {};

org.mozdev.AutoSlide.slider = function() {
  var pub = {};

  var ASPrefBranch = Components.classes["@mozilla.org/preferences-service;1"]
                                        .getService(Components.interfaces.nsIPrefService)
                                        .getBranch("extensions.AutoSlide.");
  var aConsoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                           .getService(Components.interfaces.nsIConsoleService);

  //var timeoutId;
  var timer;
  
  function debugLog(str) {
    aConsoleService.logStringMessage(Date() + " AS: " + str);
  }

  pub.init = function () {
    var mailSession = Components.classes["@mozilla.org/messenger/services/session;1"]
                                .getService(Components.interfaces.nsIMsgMailSession);
    var nsIFolderListener = Components.interfaces.nsIFolderListener;
    mailSession.AddFolderListener(folderListener, nsIFolderListener.removed |
                                                  nsIFolderListener.added |
                                                  nsIFolderListener.event);

    var quickFilterBar = document.getElementById("quick-filter-bar");
    quickFilterBar.addEventListener("DOMAttrModified", onCollapseChange, false);

    var messagePaneBox = document.getElementById("messagepanebox");
    messagePaneBox.addEventListener("DOMAttrModified", onCollapseChange, false);

    var observerService = Components.classes["@mozilla.org/observer-service;1"]
                                  .getService(Components.interfaces.nsIObserverService);
    observerService.addObserver(msgObserver, "MsgMsgDisplayed", false);

    myPrefObserver.register();

    var threadTree = document.getElementById("threadTree");
    threadTree.setAttribute("onclick",
        threadTree.getAttribute("onclick") + ";org.mozdev.AutoSlide.slider.slide();");
    threadTree.setAttribute("onkeypress",
        threadTree.getAttribute("onkeypress") + ";org.mozdev.AutoSlide.slider.delayedSlide();");

    var threadPaneSplitter = document.getElementById("threadpane-splitter");
    threadPaneSplitter.setAttribute("ondblclick",
        threadPaneSplitter.getAttribute("ondblclick") + ";org.mozdev.AutoSlide.slider.slide(true);");
    threadPaneSplitter.setAttribute("oncontextmenu",
        threadPaneSplitter.getAttribute("oncontextmenu") + ";org.mozdev.AutoSlide.slider.toggleSlide();");
    
    var tpsPersist = threadPaneSplitter.getAttribute("persist");
    debugLog("tpsPersist "+tpsPersist);
    if (!tpsPersist || !(new RegExp('\\bautoslideoff\\b').test(tpsPersist))) {
      threadPaneSplitter.setAttribute("persist", tpsPersist + " autoslideoff ");
    }
    
/*    threadTree.addEventListener("DOMAttrModified", onThreadTreeChange, false);
*/
    timer = Components.classes["@mozilla.org/timer;1"]
                               .createInstance(Components.interfaces.nsITimer);
    
    org.mozdev.AutoSlide.slider.delayedSlide();
  };

  var msgObserver = {
    observe: function (aSubject, aTopic, aData) {
    debugLog("msgObserver " + aTopic);
      org.mozdev.AutoSlide.slider.slide();
    }
  };

  function onCollapseChange(event) {
    if (event.attrName == "collapsed") {
      debugLog("onCollapseChange " + event.attrName);
      org.mozdev.AutoSlide.slider.slide();
    }
  };

  function onThreadTreeChange(event) {
    debugLog("onThreadTreeChange " + event.attrName);
  };

  var event = {  
    notify: function(timer) {  
      debugLog("delayedSlide start");
      org.mozdev.AutoSlide.slider.slide();  
    }
  };
  

  pub.delayedSlide = function () {
    debugLog("delayedSlide issued");
    timer.initWithCallback(event, 500, Components.interfaces.nsITimer.TYPE_ONE_SHOT);  
/*    timeoutId = window.setTimeout(org.mozdev.AutoSlide.slider.slide, 500);*/
  }

  pub.toggleSlide = function () {
    debugLog("toggleSlide");
    var threadPaneSplitter = document.getElementById("threadpane-splitter");
    var slideState = threadPaneSplitter.getAttribute("autoslideoff");
    if (slideState) {
      threadPaneSplitter.removeAttribute("autoslideoff");
    }
    else {
      threadPaneSplitter.setAttribute("autoslideoff", "true");
    }
  }
  
  pub.slide = function(force) {
    /*window.clearTimeout(timeoutId);*/
    timer.cancel();
    var currentTabInfo = document.getElementById("tabmail").currentTabInfo;
    if ((currentTabInfo.mode.name != "folder") &&
        (currentTabInfo.mode.name != "glodaList")) {
      //debugLog("not in folder");
      return;
    }
    if (gDBView==null) {
      return;
    }

    //var test = gFolderDisplay.displayedFolder;
    var tree = document.getElementById("threadTree");
    var treeBox = tree.boxObject;
    var treeView = gDBView.QueryInterface(Components.interfaces.nsITreeView);

    var threadPaneSplitter = document.getElementById("threadpane-splitter");
    var threadPaneSplitterBox = threadPaneSplitter.boxObject;

    if ((threadPaneSplitter.getAttribute("state") == "collapsed") || 
        ((threadPaneSplitter.getAttribute("autoslideoff")) &&
         (!force))) {
      return;
    }
    document.getElementById("messagepanebox").setAttribute("flex", "0");

    var treeView = gDBView.QueryInterface(Components.interfaces.nsITreeView);
    var count = treeView.rowCount;
    //debugLog(treeBox.getPageLength() + " of " + count);

    var minHeightPercent = ASPrefBranch.getIntPref("maxThreadPanePercentage");

    var requiredHeight = treeBox.rowHeight * count;
    var setHeight;

    var oldHeight = treeBox.height - document.getElementById("threadCols").boxObject.height - 1;
    var displayDeck = document.getElementById("displayDeck");
    var oldDisplayDeckHeight = displayDeck.boxObject.height;
    //debugLog("oldHeight: "+oldHeight);
    var deltaHeight = requiredHeight - oldHeight;

    var messagesBoxBox = document.getElementById("messagesBox").boxObject;
    var messagePaneBox = document.getElementById("messagepanebox");

    var newSplitterY = threadPaneSplitterBox.y +
                       deltaHeight;

    oldHeight = messagePaneBox.boxObject.height;
    messagePaneBox.removeAttribute("height");
    
    var minSplitterY = messagesBoxBox.y +
                       messagesBoxBox.height * minHeightPercent/100.0;

    debugLog("newSplitterY: "+newSplitterY);
    debugLog("messagesBoxBoxY: "+messagesBoxBox.y);
    debugLog("messagesBoxBoxHeight: "+messagesBoxBox.height);
    debugLog("minSplitterY: "+minSplitterY);
    debugLog("old delta: "+deltaHeight);
    
    if (newSplitterY > minSplitterY) {
      deltaHeight = deltaHeight + (minSplitterY - newSplitterY);
    }
    debugLog("new delta: "+deltaHeight);


    var anotherDelta = oldDisplayDeckHeight + deltaHeight - displayDeck.getAttribute("minheight");
    if (anotherDelta < 0) {
      deltaHeight = deltaHeight - anotherDelta;
    }

    var newHeight = oldHeight - deltaHeight;
    //debugLog("old: "+oldHeight + " new: "+newHeight);

    messagePaneBox.setAttribute("height", newHeight);
    displayDeck.setAttribute("height", displayDeck.boxObject.height);

    document.getElementById("messagepanebox").setAttribute("flex", "1");
  };

  var folderListener = {

    OnItemAdded: function(aParentItem, aItem) {
      var currentFolder = gFolderTreeView.getSelectedFolders()[0];
      if (aParentItem == currentFolder) {
        //debugLog("added " + aParentItem + " " + aItem);
        org.mozdev.AutoSlide.slider.slide();
      }
    },
    OnItemRemoved: function(aParentItem, aItem) {
      var currentFolder = gFolderTreeView.getSelectedFolders()[0];
      if (aParentItem == currentFolder) {
        //debugLog("deleted" + aParentItem + " " + aItem);
        org.mozdev.AutoSlide.slider.slide();
      }
    },
    OnItemEvent: function(aItem, aEvent) {
      //debugLog("event " +" " + aEvent);
      org.mozdev.AutoSlide.slider.slide();
    },

  };

  var myPrefObserver =
  {
    register: function()
    {
      // First we'll need the preference services to look for preferences.
      var prefService = Components.classes["@mozilla.org/preferences-service;1"]
                                  .getService(Components.interfaces.nsIPrefService);

      // For this._branch we ask that the preferences for extensions.myextension. and children
      this._branch = prefService.getBranch("extensions.AutoSlide.");

      // Now we queue the interface called nsIPrefBranch2. This interface is described as:
      // "nsIPrefBranch2 allows clients to observe changes to pref values."
      this._branch.QueryInterface(Components.interfaces.nsIPrefBranch2);

      // Finally add the observer.
      this._branch.addObserver("", this, false);
    },

    unregister: function()
    {
      if(!this._branch) return;
      this._branch.removeObserver("", this);
    },

    observe: function(aSubject, aTopic, aData)
    {
      if(aTopic != "nsPref:changed") return;
      // aSubject is the nsIPrefBranch we're observing (after appropriate QI)
      // aData is the name of the pref that's been changed (relative to aSubject)
      org.mozdev.AutoSlide.slider.slide();
    }
  }

  return pub;
}();

//org.mozdev.AutoSlide.slider.init();
window.addEventListener("load", org.mozdev.AutoSlide.slider.init, true);
