import update from 'immutability-helper'

export const onChange = (_this, label, e, callback) => {
  const t = e.target
  const value = t.type === 'checkbox' ? t.checked : t.value
  const name = t.name
  _this.setState({
    [label]: update(_this.state[label], {[name]: {$set: value}}),
    modified: true
  }, callback)
}
