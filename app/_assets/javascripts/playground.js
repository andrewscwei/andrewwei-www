// (c) Andrew Wei

'use strict';

import Requiem, { dom } from 'requiem';
import Playground from './views/Playground';

Requiem.register(Playground, 'Playground');

global.children = Requiem.sightread();
