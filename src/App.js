import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import React, {Component} from 'react';
import Navigation from './Component/Navigation/Navigation';
import Logo from './Component/Logo/Logo';
import './App.css';
import ImageLinkForm from './Component/ImageLinkForm/ImageLinkForm';
import Rank from './Component/Rank/Rank';
import FaceRecognition from "./Component/FaceRecognition/FaceRecognition";
import Clarifai from "clarifai";
import Signin from "./Component/Registration/Signin/Signin";
import Register from "./Component/Register/Register";
const MODEL_ID = 'd02b4508df58432fbb84e800597b8959';
const MODEL_VERSION_ID = 'visual-detector-embedder';
const app = new Clarifai.App({
  apiKey: '7b9f6f06bc31439e904ebd84eedf1112'
});

class App extends Component {
  constructor() {
    super();
    this.state={
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
    }
  }
  calculateFaceLocation = (data)=>{
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width= Number(image.width);
      const height= Number(image.height);
      return{
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
  }

  displayFaceBox = (box) =>{
    this.setState({box: box});
  }
  onInputChange =(event) =>{
     this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
      response =>this.displayFaceBox(this.calculateFaceLocation(response))
      ).catch(
         err=> console.log(err)
      );
  }
  
  onRouteChange = (route) => {
    if(route=='signout'){
      this.setState({isSignedIn: false})
    } else if (route =='home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() { 
    const particlesInit = async (main) => {
      console.log(main);
  
      // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      await loadFull(main);
    };
  
    const particlesLoaded = (container) => {
      console.log(container);
    };
    const {isSignedIn, imageUrl, route,box} = this.state  
    return (

      <div className="App">
         <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: {
                    enable: true,
                    mode: "push",
                  },
                  onHover: {
                    enable: true,
                    mode: "repulse",
                  },
                  resize: true,
                },
                modes: {
                  push: {
                    quantity: 4,
                  },
                  repulse: {
                    distance: 200,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                color: {
                  value: "#ffffff",
                },
                links: {
                  color: "#ffffff",
                  distance: 150,
                  enable: true,
                  opacity: 0.5,
                  width: 1,
                },
                collisions: {
                  enable: true,
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 6,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 80,
                },
                opacity: {
                  value: 0.5,
                },
                shape: {
                  type: "square",
                },
                size: {
                  value: { min: 1, max: 5 },
                },
              },
              preset:'fire',
              detectRetina: true,
            }}
          />

        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route == 'home' ?
           <div> 
          
           <Logo />
           <Rank />
           <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
           <FaceRecognition box={box} imageUrl={imageUrl}/>
       </div>
       :(
         route=='signin' ?
         <Signin onRouteChange={this.onRouteChange}/>
         :<Register onRouteChange={this.onRouteChange}/>
         
       )
          
          
          }
        
      </div>
    );
  }
}

export default App;

