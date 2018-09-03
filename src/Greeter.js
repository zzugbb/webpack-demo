import React, { Component} from 'react'

class Greeter extends Component {
  render() {
    return ( 
      <div> 
        <p>你说啥实施更新啊</p>
        <img src={require('./img/1.png')} alt=""/>
      </div>
    );
  }
}

export default Greeter