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

  pub.init = function () {
    var mailSession = Components.classes["@mozilla.org/messenger/services/session;1"]
                                .getService(Components.interfaces.nsIMsgMailSession);
    var nsIFolderListener = Components.interfaces.nsIFolderListener;
    mailSession.AddFolderListener(folderListener, nsIFolderListener.removed | 
                                                  nsIFolderListener.added |
                                                  nsIFolderListener.event);
    
    var quickFilterBar = document.getElementById("quick-filter-bar");
    quickFilterBar.addEventListener("DOMAttrModified", onQuickFilterChange, false);
    
    myPrefObserver.register();

/*    var threadTree = document.getElementById("threadTree");
    threadTree.addEventListener("DOMAttrModified", onThreadTreeChange, false);
*/    
  }

  function onQuickFilterChange(event) {
    if (event.attrName == "collapsed") {
      org.mozdev.AutoSlide.slider.slide();
    }
  };

  function onThreadTreeChange(event) {
    alert(event.attrName);
  };

  pub.slide = function() {
    var test = gFolderDisplay.displayedFolder;
    var tree = document.getElementById("threadTree");
    var treeBox = tree.boxObject;
    var treeView = gDBView.QueryInterface(Components.interfaces.nsITreeView);
    var count = treeView.rowCount;
    //alert(treeBox.getPageLength() + " of " + count);

    var minHeightPercent = ASPrefBranch.getIntPref("maxThreadPanePercentage");
    //var maxHeight = 90;
    
    var requiredHeight = treeBox.rowHeight * count;
    var setHeight;
    
    var oldHeight = treeBox.height - document.getElementById("threadCols").boxObject.height - 1;
    var displayDeck = document.getElementById("displayDeck");
    var oldDisplayDeckHeight = displayDeck.boxObject.height;
    //alert("oldHeight: "+oldHeight);
    var deltaHeight = requiredHeight - oldHeight;
    
    var threadPaneSplitterBox = document.getElementById("threadpane-splitter").boxObject;
    var messagesBoxBox = document.getElementById("messagesBox").boxObject;
    var messagePaneBox = document.getElementById("messagepanebox");
    
    var newSplitterDeltaY = threadPaneSplitterBox.y -
                            messagesBoxBox.y +
                            deltaHeight;

    oldHeight = messagePaneBox.boxObject.height;
    messagePaneBox.removeAttribute("height");
    //var boxHeight = getComputedStyle(document.getElementById("messagesBox"), '' ).height;
    var minSplitterY = messagesBoxBox.y +
                       messagesBoxBox.height * minHeightPercent/100.0;

    if (newSplitterDeltaY > minSplitterY) {
      deltaHeight = deltaHeight + (minSplitterY - newSplitterDeltaY);
    }
    //alert("delta: "+deltaHeight);
    

    var displayDeck = document.getElementById("displayDeck");
    var anotherDelta = oldDisplayDeckHeight + deltaHeight - displayDeck.getAttribute("minheight"); 
    if (anotherDelta < 0) {
      deltaHeight = deltaHeight - anotherDelta;
    }

    var newHeight = oldHeight - deltaHeight;
    //alert("old: "+oldHeight + " new: "+newHeight);
    
    messagePaneBox.setAttribute("height", newHeight);
    //displayDeck.setAttribute("height", displayDeck.boxObject.height);
    //messagePaneBox.setAttribute("height", messagePaneBox.getAttribute("height") - anotherDelta);
  };
  
  var folderListener = {
      
    OnItemAdded: function(aParentItem, aItem) {
      var currentFolder = gFolderTreeView.getSelectedFolders()[0];
      if (aParentItem == currentFolder) {
        //alert("added " + aParentItem + " " + aItem);
        org.mozdev.AutoSlide.slider.slide();
      }
    },
    OnItemRemoved: function(aParentItem, aItem) {
      var currentFolder = gFolderTreeView.getSelectedFolders()[0];
      if (aParentItem == currentFolder) {
        //alert("deleted" + aParentItem + " " + aItem);
        org.mozdev.AutoSlide.slider.slide();
      }
    },
    OnItemEvent: function(aItem, aEvent) {
      //alert("event " +" " + aEvent);
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
