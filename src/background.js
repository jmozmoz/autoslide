messenger.WindowListener.registerDefaultPrefs("defaults/preferences/prefs.js");

messenger.WindowListener.registerChromeUrl([
  ["content", "AutoSlide",           "chrome/AutoSlide/content/"],
  ["locale",  "AutoSlide", "en-US",  "chrome/AutoSlide/locale/en-US/"],
  ["locale",  "AutoSlide", "ca",     "chrome/AutoSlide/locale/de-DE/"],
  ["locale",  "AutoSlide", "de",     "chrome/AutoSlide/locale/fr/"],
  ["locale",  "AutoSlide", "es-MX",  "chrome/AutoSlide/locale/sl/"],
]);

messenger.WindowListener.registerOptionsPage("chrome://AutoSlide/content/preferences.xul");

messenger.WindowListener.registerWindow(
    "chrome://messenger/content/messenger.xul",
    "chrome://AutoSlide/content/messenger.js");

messenger.WindowListener.startListening();