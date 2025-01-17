import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import KulfyV3 from "../abis/KulfyV3.json";
import { Modal } from 'react-bootstrap';
import ModelPopUp from './ModelPopUp';
import ReactLoading from 'react-loading';

class Kulfys extends Component {

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  /**
   * [loadWeb3 Connecting to web3]
   * 
   */
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying ethereum based brower"
      );
    }
  }


  async tipKulfy(id) {
    this.setState({
      inputItem: id
    });
     this.child.current.setInputitemValue (id)
     this.child.current.isShowModal(true);
    //this.setState({ showModalPopup: true });
    //this.tipKulfyAuthor(id, "10");
  }

  /**
   * [loadBlockchainData Load mapping of NFT assets in the contract]
   * 
   */
  async loadBlockchainData() {
    this.setState({ loading: true });
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    //Network ID
    const networkId = await web3.eth.net.getId();
    const networkData = KulfyV3.networks[networkId];
    if (networkData) {
      const kulfyV3 = new web3.eth.Contract(KulfyV3.abi, networkData.address);
      this.setState({ kulfyV3 });
      const kulfiesCount = await kulfyV3.methods.tokenIds().call();
      this.setState({ kulfiesCount });

      // Load Images
      for (let i = kulfiesCount; i >= 1; i--) {
        const kulfy = await kulfyV3.methods.kulfys(i).call();
        this.setState({
          kulfies: [...this.state.kulfies, kulfy],
        });
      }

      this.setState({ loading: false });
    } else {
      window.alert("Kulfy contarct not deployed to any network");
    }
  }

  /**
   * [tipKulfyOwner Transfer tip amount to Kulfy author]
   * @param  {[type]} id        [tokenId of the NFT in contract]
   * @param  {[type]} tipAmount [amount to be transferred]
   */
  async tipKulfyAuthor(id, tipAmount) {
    this.isShowModal(false)
    this.state.kulfyV3.methods
      .tipKulfyAuthor(id,5000)
      .send({
        from: this.state.account,
        value: window.web3.utils.toWei(tipAmount, "Ether"),
      })
      .on("transactionHash", (hash) => {
        console.log("tans hash ", hash);
      });
  }
  isShowModal(state)
  {
    this.setState({ showModalPopup: state });
  }
  updateInputitemValue(evt) {
  
    this.setState({
      inputItem: evt.target.value
    });
  }
  updateInputTipValue(evt) {
 
    this.setState({
      inputTip:  evt.target.value
    });
  }
  constructor(props) {
    super(props);
    this.child=React.createRef();
    this.state = {
      account: "",
      kulfyV3: "",
      kulfies: [],
      loading: false,
      kulfy: "",
      showModalPopup: false,
      inputTip:"1",
      inputItem:""
    };
  }

  

  render() {
    return (
      <>
        {this.state.loading ? (
          <div style={{marginLeft:'47%',marginTop: '5%'}}>
            <ReactLoading type="spinningBubbles" color="#ffffff" height={100} width={70} />
          </div>
       
      ) :(
        <section className="container featured-grid">
          <div className="row d-flex justify-content-between">
            <div className="col-6">
              <button
                className="btn btn-outline-secondary dropdown-toggle filter-featured"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Latest Kulfys
                <img
                  src="https://cdn.kulfyapp.com/kulfy/downarrow_2.svg"
                  alt=""
                  className="dropdown-arrow2"
                />
              </button>
              <ul className="dropdown-menu dropdown-menu-featured bg-color2">
                <li>
                  <a className="dropdown-item" href="#">
                    FRESH-IN
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    POPULAR
                  </a>
                </li>
              </ul>
            </div>
            {/* <div className="col-2">
              <button
                type="button"
                className="btn btn-primary border-none bg-none"
                data-bs-toggle="button"
                autocomplete="off"
              >
                <img
                  src="https://cdn.kulfyapp.com/kulfy/grid_play.svg"
                  alt=""
                  class="language-icon"
                />
              </button>
            </div> */}
          </div>
          <div className="row p-05">
            {this.state.kulfies.map((item, index) => {
              return (
                <>
                  <div className="col-6 col-md-4 col-lg-3 grid-item">
                    <div className="grid-image">
                      <a href={"/kulfy?id=" + item.id}>
                        <video autoPlay loop muted width="320" height="240">
                          <source src={item.assetURI} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </a>

                      {/* <div className="grid-info">
                        <div>
                          <img
                            src="https://cdn.kulfyapp.com/kulfy/gifs_stack.svg"
                            alt=""
                          />
                          <span>GIF</span>
                          <span>16s</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary border-none btn-bookmark "
                          data-bs-toggle="button"
                          autocomplete="off"
                        >
                          <img
                            src="https://cdn.kulfyapp.com/kulfy/bookmarks_small.svg"
                            alt=""
                            className="language-icon"
                          />
                        </button>
                      </div> */}
                    </div>
                    <div className="grid-item-details">
                      <a
                        href={"https://kulfyapp.com/kulfy/" + item.kid}
                        target="blank"
                      >
                        {" "}
                        <h6>Kulfy: {item.kid}</h6>
                      </a>
                      <h6>tip: {item.tipAmount}</h6>
                      <a href={"/kulfy?id=" + item.id}>
                        {" "}
                        <h6>id: {item.id}</h6>
                      </a>
                      <h6>
                        <a href={item.tokenURI} target="blank">
                          Token URI: {item.tokenURI}
                        </a>
                      </h6>
                      <hr />
                      <div className="user-details">
                        {/* 
                        TODO:
                        *intially show Tip Creator button.
                        * When Tip Creator button clicked, Hide the button and show div with id tip-send.
                        * User will enter amount and click send button. Then meta mask will open and trasction will be made.
                        * On transaction success show hide tip-send and show div with id tip-success.
                        * after few seconds we hide tip-success and show tip creator button
                        */}
                        {/* <div id="tip-success">
                          <p>Thanks for Tipping the Creator <img src="https://cdn.kulfyapp.com/kulfy/bookmarks_small.svg"/></p>
                          <a
                          href="#"
                          className="btn-create "
                          onClick={() => this.tipKulfy(item.id)}
                        >
                          Send Tip
                        </a>
                        </div>
                        <div id="tip-send">
                          <input type="text" name="" id="" />
                          <a
                          href="#"
                          className="btn-create "
                          onClick={() => this.tipKulfy(item.id)}
                        >
                          Tip Again
                        </a>
                        </div>
                        <a
                          href="#"
                          className="btn-create "
                          onClick={}
                        >
                          Tip Creator
                        </a> */}
                        <a
                          href="#"
                          className="btn-create "
                          onClick={() => this.tipKulfy(item.id)}
                        >
                          Tip Creator
                        </a>
                        {/* <button onClick={() => this.tipKulfy(item.id)}>
                          tip kulfy
                        </button> */}
                      </div>
                    </div>
                  </div>
              
                </>
              );
            })
            }
          </div>
          
        <ModelPopUp ref={this.child} account={this.state.account} showModalPopup={this.state.showModalPopup} kulfyV3={this.state.kulfyV3}  />

     
        </section>
            )}
      </>
    );
  }
}

export default Kulfys;
