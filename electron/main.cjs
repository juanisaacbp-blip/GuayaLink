const {
  app,
  BrowserWindow
} = require('electron');

const path = require('path');


function createWindow() {

  const window = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,

    title: 'GuayaLink',

    backgroundColor: '#f8fbff',

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });


  const isDev =
    !app.isPackaged;


  if (isDev) {

    window.loadURL(
      'http://localhost:4200'
    );

  } else {

    window.loadFile(
      path.join(
        __dirname,
        '../dist/guayalink-ui/browser/index.html'
      )
    );

  }

}


app.whenReady().then(() => {

  createWindow();


  app.on(
    'activate',
    () => {

      if (
        BrowserWindow.getAllWindows().length === 0
      ) {

        createWindow();

      }

    }
  );

});


app.on(
  'window-all-closed',
  () => {

    if (
      process.platform !== 'darwin'
    ) {

      app.quit();

    }

  }
);