/**
 * (c) Andrew Wei
 */

'use strict';

import Requiem, { dom } from 'requiem';
import Playground from './views/Playground';
import Posts from './views/Posts';
import Nav from './components/Nav';
import Paginator from './components/Paginator';

Requiem.register(Playground, 'Playground');
Requiem.register(Posts, 'Posts');
Requiem.register(Nav, 'Nav');
Requiem.register(Paginator, 'Paginator');

dom.ready(() => Requiem.sightread());
