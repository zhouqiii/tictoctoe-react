
// 构建一个可搜索的产品数据表格 UI如assets/img/product

import React from 'react';
import ReactDOM from 'react-dom/client';
const data = [
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
function Product(props){
  return(
    <div>{props.product.name}  {props.product.price}</div>
  )
}
function ProductsType(props){
  const products = props.data.map((item, index) => 
    <Product key={index} product={item}/>
  )
  return(
    <div>
      <h4>{props.title}</h4>
      {products}
    </div>
  )
}
class Search extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      dataOrigin: data,
      searchValue: '',
      isCheck: false
    }
  }
  inputChange = (e) => {
    if(e.target.type === 'text'){
      this.setState({
        searchValue: e.target.value,
        dataOrigin: data.filter((item) => item.name.indexOf(e.target.value) > -1)
      })
    }else{
      this.setState({
        isCheck: e.target.checked,
        dataOrigin: e.target.checked ? data.filter((item) => item.stocked === true) : data
      })
    }
  }
  render() {
    let dataTitle = []
    this.state.dataOrigin.forEach((item, index) => {
      if(index === 0){
        dataTitle.push(item.category)
      }else{
        if(dataTitle.indexOf(item.category) < 0){
          dataTitle.push(item.category)
        }
      }
    })
    const list = dataTitle.map((item, index) => 
      <ProductsType title={item} key={index} data={this.state.dataOrigin.filter((st) => st.category === item)}/>
    )
    return(
      <div>
        <div>
          <input type="text" value={this.state.searchValue} onChange={this.inputChange} placeholder="Search..."/>
          <label><input type="checkbox" name="stocks" onChange={this.inputChange}/>Only show products in stocks</label>
        </div>
        <div>
          <h2>name   price</h2>
          {list}
        </div>
      </div>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Search />);
  