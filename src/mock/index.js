import MockAdapter from 'axios-mock-adapter';
import ajax from 'src/commons/ajax';
import { simplify } from './util';

const mock = new MockAdapter(ajax.instance);

simplify(mock, [require('./mock-users').default, require('./mock-roles').default, require('./mock-menus').default]);
