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

org.mozdev.AutoSlide.preferences = function() {
  var pub = {};
  var prefBranch;
  ///////////////////////////////////////////////////////////////////////////////
  //
  //  onLoad
  //
  //  Called when the preferences dialog has finished loading. Initializes the
  //  controls according to current configuration settings.
  //
  
  pub.onLoad = function()
  {  	
    prefBranch = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("extensions.AutoSlide.");
  
    loadPrefInt("maxThreadPanePercentage", "maxthreadpanepercentage");  
  }
  
  ///////////////////////////////////////////////////////////////////////////////
  //
  //  onDialogAccept
  //
  //  Called when the preferences dialog is closed by pressing the OK button.
  //  Saves the configuration settings.
  //
  
  pub.onDialogAccept = function ()
  {
    savePrefInt("maxThreadPanePercentage", "maxthreadpanepercentage");  
    return true;
  }
  
    
  
  function loadPrefInt(pref, idCheckbox)
  {
    document.getElementById(idCheckbox).value = prefBranch.getIntPref(pref);
  }
  

  function savePrefInt(pref, idCheckbox)
  {
    prefBranch.setIntPref(pref, document.getElementById(idCheckbox).value);
  }
  return pub;
}();
