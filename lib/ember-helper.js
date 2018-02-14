'use babel';

import EmberHelperView from './ember-helper-view';
import { CompositeDisposable } from 'atom';
import path from 'path';
import fs from 'fs';

export default {

  emberHelperView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.emberHelperView = new EmberHelperView(state.emberHelperViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.emberHelperView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    atom.workspace.observeTextEditors(() => {

    })

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'ember-helper:open-other-file-in-same-folder': () => this.openOtherFileInSameFolder()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.emberHelperView.destroy();
  },

  serialize() {
    return {
      emberHelperViewState: this.emberHelperView.serialize()
    };
  },

  openOtherFileInSameFolder() {
    const textEditor = atom.workspace.getActivePaneItem();
    const textBuffer = textEditor.buffer;
    const currentFilePath = textBuffer.file.path;
    const dirname = path.dirname(currentFilePath);
    const basename = path.basename(currentFilePath);

    fs.readdir(dirname, (err, files) => {
      const index = files.indexOf(basename);
      const nextFile = files[(index + 1) % files.length];
      const nextFilePath = path.join(dirname, nextFile);

      atom.workspace.open(nextFilePath);
    })
  },
};
