import {
  isFunction,
  isArray,
  isPlainObject,
  isInteger,
  isFinite,
  isBoolean,
  isString,
  isNull,
  inRange,
  pickBy,
  has,
  keys,
  isNumber,
} from 'lodash-es'

class Color {}
class Image {}
class Font {}
class LinearGradient {}
class Point {}
class Size {}

const WIDGET_SIZE = {
  SMALL: 0,
  MEDIUM: 1,
  LARGE: 2,
}

const ALIGN = {
  LEFT: 0,
  CENTER: 1,
  RIGHT: 2,
}

const DATE_STYLE = {
  TIME: 0,
  DATE: 1,
  RELATIVE: 2,
  OFFSET: 3,
  TIMER: 4,
}

const PROP_TYPES = {
  widget: {
    background: {
      color: Color,
      image: Image,
      linearGradient: LinearGradient,
    },
    spacing: Number,
    url: String,
    refreshAfterDate: Date,
    padding: {
      top: Number,
      left: Number,
      bottom: Number,
      right: Number,
    },
    present: [
      WIDGET_SIZE.SMALL,
      WIDGET_SIZE.MEDIUM,
      WIDGET_SIZE.LARGE
    ],
  },
  text: {
    color: Color,
    font: Font,
    opacity: Number,
    lineLimit: Number,
    minimumScaleFactor: Number,
    shadow: {
      color: Color,
      radius: Number,
      offset: Point,
    },
    url: String,
    align: [
      ALIGN.LEFT,
      ALIGN.CENTER,
      ALIGN.RIGHT,
    ],
  },
  image: {
    src: Image,
    resizable: Boolean,
    size: Size,
    opacity: Number,
    border: {
      radius: Number,
      width: Number,
      color: Color,
    },
    containerRelativeShape: Boolean,
    tintColor: Color,
    url: String,
    align: [
      ALIGN.LEFT,
      ALIGN.CENTER,
      ALIGN.RIGHT,
    ],
    contentMode: Boolean, // true - fitting, false - filling
  },
  date: {
    value: Date,
    color: Color,
    font: Font,
    opacity: Number,
    lineLimit: Number,
    minimumScaleFactor: Number,
    shadow: {
      color: Color,
      radius: Number,
      offset: Point,
    },
    url: String,
    align: [
      ALIGN.LEFT,
      ALIGN.CENTER,
      ALIGN.RIGHT,
    ],
    style: [
      DATE_STYLE.TIME,
      DATE_STYLE.DATE,
      DATE_STYLE.RELATIVE,
      DATE_STYLE.OFFSET,
      DATE_STYLE.TIMER,
    ],
  },
  spacer: {
    length: Number,
  },
  stack: {
    background: {
      color: Color,
      image: Image,
      linearGradient: LinearGradient,
    },
    spacing: Number,
    size: Size,
    border: {
      radius: Number,
      width: Number,
      color: Color,
    },
    url: String,
    padding: {
      top: Number,
      left: Number,
      bottom: Number,
      right: Number,
    },
    align: [
      ALIGN.LEFT,
      ALIGN.CENTER,
      ALIGN.RIGHT,
    ],
    layout: Boolean, // true - horizontally, false - vertically
  }
}

function x(type, config, ...children) {
  let props = { ...config, children }
  
  // custom functional component
  if (isFunction(type)) return type(props)

  // validate native component type
  if (!has(PROP_TYPES, type)) throw new Error('Invalid type')
  
  const expectedPropTypes = PROP_TYPES[type]
  const expectedProps = keys(expectedPropTypes)
  expectedProps.push('children')

  // pick valid prop keys with valid values
  const validPropKeys = keys(props).filter(key => {
    if (!expectedProps.includes(key)) return false
    const actualValue = props[key]
    if (key === 'children') return actualValue.length > 0
    const expectedType = expectedPropTypes[key]

    if (isArray(expectedType)) {
      return isInteger(actualValue) && inRange(actualValue, expectedType.length)
    }

    if (isPlainObject(expectedType)) {
      if (!isPlainObject(actualValue)) return false
      for (let subType of keys(actualValue)) {
        if (!has(expectedType, subType)) continue
        if (expectedType === Number) return isFinite(actualValue)
        if (!(actualValue[subType] instanceof expectedType[subType])) return false
      }
      return true
    }

    switch (expectedType) {
      case Number:
        return isFinite(actualValue)
      case Boolean:
        return isBoolean(actualValue)
      case String:
        return isString(actualValue)
      case null:
        return isNull(actualValue)
      default:
        return actualValue instanceof expectedType
    }
  })

  props = pickBy(props, (value, key) => validPropKeys.includes(key))

  if (props.children?.length === 1) {
      props.children = props.children[0]
  }

  return {
    type,
    props,
  }
}

function render(tree) {
  console.log(JSON.stringify(tree))
}

export { x, render }
