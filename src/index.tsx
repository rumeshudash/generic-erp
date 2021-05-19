import React from 'react';
import ReactDOM from 'react-dom';

import { firebaseCloudMessaging } from './push-notification';

import './Assets/Global-Shared/tailwind.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import './Assets/Global-Shared/global.scss';

import { InitLibrary } from 'sl-web-utilities';
import * as StateManagerUtils from 'state-manager-utility';
import * as StorageUtility from 'storage-utility';
import GLOBAL from './Constants/global.constants';
import { EntryComponent } from 'sl-web-utilities';

import registerServiceWorker from './registerServiceWorker';

InitLibrary({ StateManager: StateManagerUtils, StorageUtility, env: GLOBAL });

ReactDOM.render(<EntryComponent />, document.getElementById('admin-root'));

firebaseCloudMessaging.init();
registerServiceWorker();
