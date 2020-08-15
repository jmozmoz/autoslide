# AutoSlide

The AutoSlide addon automatically moves the splitter between the thread and the
message pane in Thundbird so that the thread pane is set to a optimal height.

It is hosted at [addons.thunderbird.net](https://addons.thunderbird.net/thunderbird/addon/autoslide/)


### Description

The AutoSlide addon automatically moves the splitter between the thread and
the message pane in Thundbird. The position of the splitter is adjusted
in a way that all messages are displayed in the thread pane if possible.
At the same time the splitter is moved so that the height of the thread pane
is as small as possible.

Double click on the thread pane splitter causes it to automatically
slide in to optimal position.

Right click on the thread pane splitter toggles the autosplit feature
(dark color means no autosplit).

The maximal size of the thread pane can be set in the addon preferences.

### Known bugs

### Installing

Search for it in the add/on manager of Thunderbird or download the installation
file from [addons.thunderbird.net](https://addons.thunderbird.net/thunderbird/addon/autoslide/)
and then install AutoSlide within the add-on manager of Thunderbird.

### Support

File a bug report here on github.

### Build the xpi

In the src folder issue the commmand

```
ant dist
```

## Authors

* **Joachim Herb** - [jmozmoz](https://github.com/jmozmoz)

## License

This project is licensed under [MPL 1.1](http://www.mozilla.org/MPL/)/GPL 2.0/LGPL 2.1
