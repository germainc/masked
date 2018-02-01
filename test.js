import test from 'ava';
import huna from './index';

test('it throws an Error when data is not given', t => {
  const error = t.throws(() => huna(), Error);
  t.is(error.message, 'First parameter `data` not given');
});

test('it throws a TypeError when data is a string', t => {
  const error = t.throws(() => huna('test'), TypeError);
  t.is(error.message, 'Expected an object or array, got string');
});

test('it throws a TypeError when data is a number', t => {
  const error = t.throws(() => huna(1), TypeError);
  t.is(error.message, 'Expected an object or array, got number');
});

test('it throws an Error when keys is not given', t => {
  const error = t.throws(() => huna({}), Error);
  t.is(error.message, 'Second parameter `keys` not given');
});

test('it throws a TypeError when keys is an object', t => {
  const error = t.throws(() => huna({}, {}), TypeError);
  t.is(error.message, 'Expected a string or array, got object');
});

test('it throws a TypeError when keys is a number', t => {
  const error = t.throws(() => huna({}, 1), TypeError);
  t.is(error.message, 'Expected a string or array, got number');
});

test('it masks sensitive values in an object (one key)', t => {
  const object = {
    username: 'jake',
    password: 'UnicornsAreAwesome'
  };

  const maskedObject = huna(object, 'password');

  t.deepEqual(maskedObject, {username: 'jake', password: '********'});
});

test('it masks sensitive values in an array (one key)', t => {
  const array = [{
    username: 'jake',
    password: 'UnicornsAreAwesome'
  }, {
    username: 'richard',
    password: 'LitAF'
  }];

  const maskedArray = huna(array, 'password');

  t.deepEqual(maskedArray, [{
    username: 'jake',
    password: '********'
  }, {
    username: 'richard',
    password: '********'
  }]);
});

test('it masks sensitive values in an object (multiple keys)', t => {
  const object = {
    username: 'jake',
    password: 'UnicornsAreAwesome',
    mobile: '1800-YOU-WISH'
  };

  const maskedObject = huna(object, ['password', 'mobile']);
  t.deepEqual(maskedObject, {username: 'jake', password: '********', mobile: '********'});
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

  const maskedArray = huna(array, ['password', 'mobile']);

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

test('it masks sensitive values in an object (one key, 2nd level)', t => {
  const object = {
    someKey: 'someVal',
    user: {
      username: 'jake',
      password: 'UnicornsAreAwesome'
    }
  };

  const maskedObject = huna(object, 'password');

  t.deepEqual(maskedObject, {
    someKey: 'someVal',
    user: {
      username: 'jake',
      password: '********'
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

  const maskedArray = huna(array, 'password');

  t.deepEqual(maskedArray, [['wow', {
    username: 'jake',
    password: '********'
  }], ['test', {
    username: 'richard',
    password: '********'
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

  const maskedObject = huna(object, ['password', 'mobile']);

  t.deepEqual(maskedObject, {
    someKey: 'someVal',
    user: {
      username: 'jake',
      password: '********',
      mobile: '********'
    }
  });
});

test('it masks sensitive values in an object (multiple keys, complex)', t => {
  const object = {
    someKey: 'someVal',
    user: {
      data: {
        username: 'jake',
        password: 'UnicornsAreAwesome'
      },
      mobile: '1800-YOU-WISH'
    }
  };

  const maskedObject = huna(object, ['password', 'mobile']);

  t.deepEqual(maskedObject, {
    someKey: 'someVal',
    user: {
      data: {
        username: 'jake',
        password: '********'
      },
      mobile: '********'
    }
  });
});

test('it masks sensitive values in an array (multiple keys, complex)', t => {
  const array = [[{
    user: {
      data: {
        username: 'jake',
        password: 'UnicornsAreAwesome'
      }
    },
    mobile: '1800-YOU-WISH'
  }], ['test', {
    user: {
      data: {
        username: 'richard',
        password: 'lit af'
      }
    },
    mobile: '1800-GET-LIT'
  }, '1']];

  const maskedArray = huna(array, ['password', 'mobile']);

  t.deepEqual(maskedArray, [[{
    user: {
      data: {
        username: 'jake',
        password: '********'
      }
    },
    mobile: '********'
  }], ['test', {
    user: {
      data: {
        username: 'richard',
        password: '********'
      }
    },
    mobile: '********'
  }, '1']]);
});

test('it masks sensitive values in an array which is in an object', t => {
  const object = {
    title: 'hello everyone',
    data: {
      users: [
        {name: 'jim', password: 'im cool', mobile: '04 you wish'},
        {name: 'jake', password: 'awesome stuff', mobile: '04 go away'}
      ]
    }
  };

  const maskedObject = huna(object, ['password', 'mobile']);

  t.deepEqual(maskedObject, {
    title: 'hello everyone',
    data: {
      users: [
        {name: 'jim', password: '********', mobile: '********'},
        {name: 'jake', password: '********', mobile: '********'}
      ]
    }
  });
});

test('it masks sensitive values in an object which has a sensitive array', t => {
  const object = {
    data: {
      mobileNumbers: ['1234', '5678']
    }
  };

  const maskedObject = huna(object, ['mobileNumbers']);

  t.deepEqual(maskedObject, {
    data: {
      mobileNumbers: ['********', '********']
    }
  });
});

test('it masked sensitive values (mixed)', t => {
  const user = {
    firstName: 'jake',
    password: 'IAmCool',
    mobileNumbers: ['0400123123', '0411223444'],
    providerData: [{providerNumber: '123456'}, {providerNumber: '123456'}]
  };

  const maskedObject = huna(user, ['password', 'mobileNumbers', 'providerNumber']);

  t.deepEqual(maskedObject, {
    firstName: 'jake',
    password: '********',
    mobileNumbers: ['********', '********'],
    providerData: [{providerNumber: '********'}, {providerNumber: '********'}]
  });
});