import React from 'react';
import './App.css';
import {getData} from './reuests';
import $ from 'jquery'; 

class App extends React.Component {

  state = {
    categoryList: [],
    selectedIndex: null,
    selectedId: null,
    selectedProducts: [],
    isLoading: false
  }

  loadInitialCategories = () => {
    let params = null;
    let url = 'https://backend.ustraa.com/rest/V1/api/homemenucategories/v1.0.1?device_type=mob';
    try{
      getData(url, params).then((res) => {
        this.setState({
          categoryList: res.data.category_list,
          selectedIndex: 0,
          selectedId: res.data.category_list[0],
          selectedProducts: res.data.product_list.products
        });
      });
    }catch(error){
      console.log(error);
    } 
  }

  loadProduct = (id) => {
    let params = {category_id: id};
    let url = 'https://backend.ustraa.com/rest/V1/api/catalog/v1.0.1';
    try{
      getData(url,params).then((res) => {
        this.setState({
          selectedProducts: res.data.products,
          isLoading: false
        });
      });
    }catch(error){
      console.log(error);
    }
  }

  changeCategory = (id, index) => {
    if (id !== this.state.selectedId) {
      $(".slider").animate({scrollLeft: index*120}, 100);
      this.setState({
        selectedId: id, 
        selectedIndex: index, 
        selectedProducts: [],
        isLoading: false
      });
      this.loadProduct(id);
    }
  }


  componentWillMount() {
    this.loadInitialCategories();
  };

  render() {
    let selectedListView = this.state.selectedProducts.slice(0, 3);
    return (
      <div className="container">
        <div className="container-center">
          <div className="category_slider">
            {this.state.categoryList.map((value, index) => {
              let styled = {
                backgroundImage: "url('"+ value.category_image +"')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              };
              if (this.state.selectedId === value.category_id) {
                styled.fontWeight = 'bolder';
              }
              let id = value.category_id;
              return (
                <div key={index} className="category_object" onClick={() => this.changeCategory(id, index)}>
                  <div className="category_content" style={styled}>{value.category_name}</div>
                </div>
              );
            })}
          </div>
          <div className="products_list">
            {(!this.state.isLoading && this.state.selectedProducts) ? 
              (selectedListView.map((value) => {
                return (
                  <div className="product_object" key={value.id}>
                    <div className="product_image"><img src={value.image_urls.x300} alt={value.name} /></div>
                    <div className="product_detail">
                      <div className="product_name"><p>{value.name}</p></div>
                      <div className="product_weight"><p>({value.weight} {value.weight_unit})</p></div>
                      <div className="product_amount">{(value.price !== value.final_price) ? <p>&#8377; {value.final_price}<small><s>&#8377; {value.price}</s></small></p> : <p>&#8377; {value.price}</p> }</div>
                      <div className="product_action">{(value.is_in_stock) ? <button>ADD TO CART</button> : <button className="out_of_stock">OUT OF STOCK</button>}</div>
                    </div>
                    <div className="product_rating">
                      <p>4 <svg viewBox="0 0 24 24" className="rate_star"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg></p>
                    </div>
                  </div>
                );
              }))
                
              : <div style={{marginTop: '50px'}}>Loading ...</div>
            }
                
          </div>
        </div>
      </div>
    );

  }

}

export default App;
