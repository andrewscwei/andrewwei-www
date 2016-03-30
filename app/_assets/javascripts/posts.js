// (c) Andrew Wei

'use strict';

import Requiem, { dom } from 'requiem';
import Posts from './views/Posts';
import Paginator from './components/Paginator';

Requiem.register(Posts, 'Posts');
Requiem.register(Paginator, 'Paginator');

global.children = Requiem.sightread();
