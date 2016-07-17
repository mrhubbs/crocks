const test = require('tape')

const bindFunc = require('../test/helpers').bindFunc

const identity  = require('../combinators/identity')
const constant  = require('../combinators/constant')

const Any = require('./Any')

test('Any', t => {
  const a = bindFunc(Any)
  t.equal(typeof Any, 'function', 'is a function')

  // TODO: Move to ok
  t.equal(typeof Any.empty, 'function', 'provides an empty function')
  t.equal(typeof Any.type, 'function', 'provides a type function')
  t.equal(Any(0).toString(), '[object Object]', 'returns an object')

  t.throws(Any, TypeError, 'throws when nothing is passed')
  t.throws(a(identity), TypeError, 'throws when passed a function')

  t.doesNotThrow(a(undefined), 'allows undefined')
  t.doesNotThrow(a(null), 'allows null')
  t.doesNotThrow(a(0), 'allows a falsey number')
  t.doesNotThrow(a(1), 'allows a truthy number')
  t.doesNotThrow(a(''), 'allows a falsey string')
  t.doesNotThrow(a('string'), 'allows a truthy string')
  t.doesNotThrow(a(false), 'allows false')
  t.doesNotThrow(a(true), 'allows true')
  t.doesNotThrow(a([]), 'allows an array')
  t.doesNotThrow(a({}), 'allows an object')

  t.end()
})

test('Any value', t => {
  // TODO: move to ok
  t.equal(typeof Any(0).value, 'function', 'is a function')

  t.equal(Any(undefined).value(), false, 'reports false for undefined')
  t.equal(Any(null).value(), false, 'reports false for null')
  t.equal(Any(0).value(), false, 'reports false for falsey number')
  t.equal(Any(1).value(), true, 'reports true for truthy number')
  t.equal(Any('').value(), false, 'reports false for falsey number')
  t.equal(Any('string').value(), true, 'reports true for truthy string')
  t.equal(Any(false).value(), false, 'reports false for false')
  t.equal(Any(true).value(), true, 'reports true for true')
  t.equal(Any([]).value(), true, 'reports true for an array')
  t.equal(Any({}).value(), true, 'reports true for an object')

  t.end()
})

test('Any type', t => {
  // TODO: move to ok, add compare spec (instance/static)
  t.equal(typeof Any(0).type, 'function', 'is a function')
  t.equal(Any(0).type(), 'Any', 'reports the expected type')

  t.end()
})

test('Any concat properties (Semigoup)', t => {
  const a = Any(0)
  const b = Any(true)
  const c = Any('')

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.equal(typeof a.concat, 'function', 'provides a concat function')
  t.equal(left.value(), right.value(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns an Any')

  t.end()
})

test('Any concat functionality', t => {
  const a = Any(true)
  const b = Any(false)

  const notAny = { type: constant('Any...Not') }

  const cat = bindFunc(a.concat)

  t.throws(cat(undefined), TypeError, 'throws when passed undefined')
  t.throws(cat(null), TypeError, 'throws when passed null')
  t.throws(cat(0), TypeError, 'throws when passed falsey number')
  t.throws(cat(1), TypeError, 'throws when passed truthy number')
  t.throws(cat(''), TypeError, 'throws when passed falsey string')
  t.throws(cat('string'), TypeError, 'throws when passed truthy string')
  t.throws(cat(false), TypeError, 'throws when passed false')
  t.throws(cat(true), TypeError, 'throws when passed true')
  t.throws(cat([]), TypeError, 'throws when passed array')
  t.throws(cat({}), TypeError, 'throws when passed object')
  t.throws(cat(notAny), TypeError, 'throws when passed non-Any')

  t.equal(a.concat(b).value(), true, 'true to false reports true')
  t.equal(a.concat(a).value(), true, 'true to true reports true')
  t.equal(b.concat(b).value(), false, 'false to false reports false')

  t.end()
})

test('Any empty properties (Monoid)', t => {
  const m = Any(3)

  t.equal(typeof m.concat, 'function', 'provides a concat function')
  t.equal(typeof m.empty, 'function', 'provides an empty function')

  const right = m.concat(m.empty())
  const left  = m.empty().concat(m)

  t.equal(right.value(), m.value(), 'right identity')
  t.equal(left.value(), m.value(), 'right identity')

  t.end()
})

test('Any empty functionality', t => {
  const x = Any(0).empty()

  t.equal(x.type(), 'Any', 'provides an Any')
  t.equal(x.value(), false, 'wraps a false value')

  t.end()
})