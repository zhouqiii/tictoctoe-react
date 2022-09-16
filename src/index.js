import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={ () => this.props.onClick() }
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }
  // 相比于上面基于React.Component的<classs组件>Square，这里把该组件用<函数组件>的形式实现
  // 函数组件是react实现简单组件的首选方式，它本质上就是一个js函数，
  // 如果你想写的组件只包含一个render方法，并且不包括state，那么使用函数组件就会更简单，函数组件固定接收props作为参数，并返回用于页面展示内容的react元素
  function Square(props){
    return (
      <button
        className="square"
        onClick={ () => props.onClick() }
      >
        {props.value}
      </button>
    )
  }
  function calculateWinner(squares){
    const winnerList = [
      [0, 1, 2],
      [1, 4, 7],
      [2, 5, 8],
      [3, 4, 5],
      [0, 3, 6],
      [0, 4, 8],
      [2, 4, 6],
      [6, 7, 8],
    ]
    for(let i = 0; i < winnerList.length; i++){
      const [a, b, c] = winnerList[i]
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
        return squares[a]
      }
    }
    return null
  }
  class Board extends React.Component {
    renderSquare(i) {
      return <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />;
    }
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    // 在JavaScript的类class中，每次你定义其子类的构造函数时，都需要调用super方法: React.Component是react定义的组件类，Square是它的子类，Square的构造函数就需要先调用super方法
    // 那么也就是说，在所有含有构造函数的react组件中，构造函数必须以super(props)开头
    constructor(props){
      super(props)
      this.state = {
        history: [{//用来保存历史记录
          squares: Array(9).fill(null)
        }],
        backToStep: 0, // 用于给用户展示当前的步骤
        isNextX: true
      }
    }
    handleClick(i) {
      // 因为jumpTo是使用backToStep标记实现的不是直接改变history，如果点击了回退，然后再走一步新棋子，原来的未来历史数据就不正确了，所以这个替换就是把history也替换为正确的未来历史数据
      const history = this.state.history.slice(0, this.state.backToStep+1) // slice不会改变原始数组,所以square是state.squares的一个副本
      const current = history[history.length-1]
      const square = current.squares.slice()
      if(calculateWinner(square)){
        return
      }else{
        square[i] = this.state.isNextX ? 'X' : 'O'
        this.setState({//每次在组件中调用setState时， react都会自动更新其子组件
          history: history.concat([{// concat方法与push方法不太一样，他不会改变原数组，与slice使用的目的一致，所以推荐使用concat
            squares: square
          }]),
          isNextX: !this.state.isNextX,
          backToStep: history.length
        })
        return square[i]
      }
    }
    jumpTo(i){// 不直接setState全替换history的值， 而是通过设置backToStep来标记实现回退
      this.setState({
        backToStep: i,
        isNextX: (i%2) === 0
      })
    }
    render() {
      const { history } = this.state
      const current = history[this.state.backToStep]
      const status = calculateWinner(current.squares)
        ? `Winner: ${calculateWinner(current.squares)}`
        : `Next player: ${this.state.isNextX ? 'X' : 'O'}`
      const moves = this.state.history.map((step, move) => {
        const desc = move ? `Go to move #${move}` : 'Go to game start'
        return (<li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>)
      })
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={ (i) => this.handleClick(i) }/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  