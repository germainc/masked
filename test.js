import test from 'ava';
import masked from './index';

test('it returns nothing when data is not given', t => {
  t.true(masked() === null);
});

test('it returns the original data when data is a string', t => {
  t.true(masked('somestring', 'password') === 'somestring');
});

test('it returns the original data when data is a number', t => {
  t.true(masked(1, 'password') === 1);
});

test('it throws an Error when keys is not given', t => {
  const error = t.throws(() => masked({}), Error);
  t.is(error.message, 'Second parameter `keys` not given');
});

test('it throws a TypeError when keys is an object', t => {
  const error = t.throws(() => masked({}, {}), TypeError);
  t.is(error.message, 'Expected a string or array, got object');
});

test('it throws a TypeError when keys is a number', t => {
  const error = t.throws(() => masked({}, 1), TypeError);
  t.is(error.message, 'Expected a string or array, got number');
});

test('it masks sensitive values in an object (one key)', t => {
  const object = {
    username: 'jake',
    password: 'UnicornsAreAwesome'
  };

  const maskedObject = masked(object, 'password');

  t.deepEqual(maskedObject, {username: 'jake', password: '********'});
});

test('it masks sensitive values in an object (one key and omitKeys is true)', t => {
  const object = {
    username: 'jake',
    password: 'UnicornsAreAwesome'
  };

  const maskedObject = masked(object, 'password', {omitKeys: true});

  t.deepEqual(maskedObject, {username: 'jake'});
});

test('it masks sensitive values in an array (one key)', t => {
  const array = [{
    username: 'jake',
    password: 'UnicornsAreAwesome'
  }, {
    username: 'richard',
    password: 'LitAF'
  }];

  const maskedArray = masked(array, 'password');

  t.deepEqual(maskedArray, [{
    username: 'jake',
    password: '********'
  }, {
    username: 'richard',
    password: '********'
  }]);
});

test('it masks sensitive values in an array (one key and omitKeys is true)', t => {
  const array = [{
    username: 'jake',
    password: 'UnicornsAreAwesome'
  }, {
    username: 'richard',
    password: 'LitAF'
  }];

  const maskedArray = masked(array, 'password', {omitKeys: true});

  t.deepEqual(maskedArray, [{
    username: 'jake'
  }, {
    username: 'richard'
  }]);
});

test('it masks sensitive values in an object (multiple keys)', t => {
  const object = {
    username: 'jake',
    password: 'UnicornsAreAwesome',
    mobile: '1800-YOU-WISH'
  };

  const maskedObject = masked(object, ['password', 'mobile']);
  t.deepEqual(maskedObject, {username: 'jake', password: '********', mobile: '********'});
});

test('it masks sensitive values in an object (multiple keys and omitKeys is true)', t => {
  const object = {
    username: 'jake',
    password: 'UnicornsAreAwesome',
    mobile: '1800-YOU-WISH'
  };

  const maskedObject = masked(object, ['password', 'mobile'], {omitKeys: true});
  t.deepEqual(maskedObject, {username: 'jake'});
});

test('it masks sensitive values in an array (multiple keys)', t => {
  const array = [{
    username: 'jake',
    password: 'UnicornsAreAwesome',
    mobile: '1800-YOU-WISH'
  }, {
    username: 'richard',
    password: 'LitAF',
    mobile: '1800-GET-LIT'
  }];

  const maskedArray = masked(array, ['password', 'mobile']);

  t.deepEqual(maskedArray, [{
    username: 'jake',
    password: '********',
    mobile: '********'
  }, {
    username: 'richard',
    password: '********',
    mobile: '********'
  }]);
});

test('it masks sensitive values in an array (multiple keys and omitKeys is true)', t => {
  const array = [{
    username: 'jake',
    password: 'UnicornsAreAwesome',
    mobile: '1800-YOU-WISH'
  }, {
    username: 'richard',
    password: 'LitAF',
    mobile: '1800-GET-LIT'
  }];

  const maskedArray = masked(array, ['password', 'mobile'], {omitKeys: true});

  t.deepEqual(maskedArray, [{
    username: 'jake'
  }, {
    username: 'richard'
  }]);
});

test('it masks sensitive values in an object (one key, 2nd level)', t => {
  const object = {
    someKey: 'someVal',
    user: {
      username: 'jake',
      password: 'UnicornsAreAwesome'
    }
  };

  const maskedObject = masked(object, 'password');

  t.deepEqual(maskedObject, {
    someKey: 'someVal',
    user: {
      username: 'jake',
      password: '********'
    }
  });
});

test('it masks sensitive values in an object (one key, 2nd level, omitKeys is true)', t => {
  const object = {
    someKey: 'someVal',
    user: {
      username: 'jake',
      password: 'UnicornsAreAwesome'
    }
  };

  const maskedObject = masked(object, 'password', {omitKeys: true});

  t.deepEqual(maskedObject, {
    someKey: 'someVal',
    user: {
      username: 'jake'
    }
  });
});

test('it masks sensitive values in an array (one key, 2nd level)', t => {
  const array = [['wow', {
    username: 'jake',
    password: 'UnicornsAreAwesome'
  }], ['test', {
    username: 'richard',
    password: 'LitAF'
  }]];

  const maskedArray = masked(array, 'password');

  t.deepEqual(maskedArray, [['wow', {
    username: 'jake',
    password: '********'
  }], ['test', {
    username: 'richard',
    password: '********'
  }]]);
});

test('it masks sensitive values in an array (one key, 2nd level, omitKeys is true)', t => {
  const array = [['wow', {
    username: 'jake',
    password: 'UnicornsAreAwesome'
  }], ['test', {
    username: 'richard',
    password: 'LitAF'
  }]];

  const maskedArray = masked(array, 'password', {omitKeys: true});

  t.deepEqual(maskedArray, [['wow', {
    username: 'jake'
  }], ['test', {
    username: 'richard'
  }]]);
});

test('it masks sensitive values in an object (multiple keys, 2nd level)', t => {
  const object = {
    someKey: 'someVal',
    user: {
      username: 'jake',
      password: 'UnicornsAreAwesome',
      mobile: '1800-YOU-WISH'
    }
  };

  const maskedObject = masked(object, ['password', 'mobile']);

  t.deepEqual(maskedObject, {
    someKey: 'someVal',
    user: {
      username: 'jake',
      password: '********',
      mobile: '********'
    }
  });
});

test('it masks sensitive values in an object (multiple keys, 2nd level, omitKeys is true)', t => {
  const object = {
    someKey: 'someVal',
    user: {
      username: 'jake',
      password: 'UnicornsAreAwesome',
      mobile: '1800-YOU-WISH'
    }
  };

  const maskedObject = masked(object, ['password', 'mobile'], {omitKeys: true});

  t.deepEqual(maskedObject, {
    someKey: 'someVal',
    user: {
      username: 'jake'
    }
  });
});

test('it masks sensitive values in an object (multiple keys, complex)', t => {
  const object = {
    user: {
      data: {
        name: 'John Smith',
        creditCards: {
          'card-id-1': {
            type: 'Visa',
            number: '4444-5555-6666-7777',
            address: ['address', 'city', 'state', 'zip'],
            exp: {
              month: 4,
              year: 2019
            }
          },
          'card-id-2': {
            type: 'Amex',
            number: '1111-2222-3333-4444',
            exp: {
              month: 5,
              year: 2022
            }
          }
        },
        publicInfo: {
          userName: 'jsmith'
        }
      }
    }
  };

  const maskedObject = masked(object, ['creditCards']);

  t.deepEqual(maskedObject, {
    user: {
      data: {
        name: 'John Smith',
        creditCards: {
          'card-id-1': {
            type: '********',
            number: '********',
            address: ['********', '********', '********', '********'],
            exp: {
              month: '********',
              year: '********'
            }
          },
          'card-id-2': {
            type: '********',
            number: '********',
            exp: {
              month: '********',
              year: '********'
            }
          }
        },
        publicInfo: {
          userName: 'jsmith'
        }
      }
    }
  });
});

test('it masks a nested object matching a sensitive key (omitKeys is true)', t => {
  const object = {
    user: {
      data: {
        name: 'John Smith',
        creditCards: {
          'card-id-1': {
            type: 'Visa',
            number: '4444-5555-6666-7777'
          },
          'card-id-2': {
            type: 'Amex',
            number: '1111-2222-3333-4444'
          }
        },
        publicInfo: {
          userName: 'jsmith'
        }
      }
    }
  };

  const maskedObject = masked(object, ['creditCards'], {omitKeys: true});

  t.deepEqual(maskedObject, {
    user: {
      data: {
        name: 'John Smith',
        publicInfo: {
          userName: 'jsmith'
        }
      }
    }
  });
});
