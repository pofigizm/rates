import React, { Component } from 'react'
import './App.css'

const read = (key) => {
  return JSON.parse(localStorage.getItem(key))
}

const save = (key, data = {}) => {
  return localStorage.setItem(key, JSON.stringify(data))
}

const users = ['player 1', 'player 2', 'player 3']
const date = (new Date()).toString().split(' ').splice(1,3).join(' ')

class App extends Component {
  constructor() {
    super()
    this.state = {
      users: read('users') || users,
      parties: read(`parties-${date}`) || [],
      date: date,
      dates: {
        ...(read('dates') || {}),
        [date]: true,
      },
    }
    this.change = this.change.bind(this)
    this.add = this.add.bind(this)
  }

  change(part, user, value) {
    const parties = this.state.parties

    parties[part][user] = +value
    this.setState({
      parties,
    })
    save(`parties-${date}`, parties)
    save('dates', this.state.dates)
  }

  add() {
    const party = ('' + prompt('input result'))
      .split('')
      .map(el => +el)

    const res = users.map((_, i) => party[i] || 0)

    this.setState({
      parties: this.state.parties.concat([res]),
    })
  }

  render() {
    const sum = this.state.users.map((us, ix) => {
      return this.state.parties.reduce((acc, part) => {
        return [
          +acc[0] + ( (+Math.max(...part) === +part[ix] && part[ix] !== 0) ? 1 : 0 ),
          +acc[1] + (+part[ix]),
        ]
      }, [0, 0])
    })

    return (
      <div className="App">
        <div className="App-header">
          <h2>Rates</h2>
        </div>
        <table>
          <tr>
            <th>
              <span>
                parties
              </span>
            </th>
            { this.state.users.map((el, ix) => (
              <th>
                <input
                  onChange={() => {}}
                  value={el}
                />
              </th>
            )) }
          </tr>
          { this.state.parties.map((part, prIx) => (
            <tr>
              <td>
                <span>
                  { prIx + 1 }
                </span>
              </td>
              { this.state.users.map((_, ix) => (
                <td>
                  <input
                    type="number"
                    onChange={(ev) => this.change(prIx, ix, ev.target.value)}
                    value={part[ix] || ''}
                  />
                </td>
              )) }
            </tr>
          )) }
          <tr>
            <td colSpan="4">
              <button style={{ height: 30 }} onClick={this.add}>Add</button>
            </td>
          </tr>
          <tr>
            <td>
              <span>
                w / b
              </span>
            </td>
            { sum.map((el, ix) => (
              <td>
                <span>
                 { `${el[0]} / ${el[1]}` }
                </span>
              </td>
            )) }
          </tr>
        </table>
      </div>
    )
  }
}

export default App
