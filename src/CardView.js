import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Platform,
  ImageBackground
} from "react-native";

import PropTypes from "prop-types";

import defaultIcons from "./Icons";
import FlipCard from "react-native-flip-card";

const BASE_SIZE = { width: 344, height: 188 };

const s = StyleSheet.create({
  cardContainer: {},
  cardFaceContainer:{
    shadowColor: '#5b8aec',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.6,
    borderRadius: 5,
  },
  cardFace: {
    position: 'relative',
    resizeMode: 'cover',
    borderRadius: 5,
    borderColor: '#d0d4e6',
    borderWidth: Platform.select({android: 1, ios: 0})
  },
  icon: {
    position: "absolute",
    top: 23,
    right: 26,
    width: 60,
    height: 40,
    resizeMode: "contain",
  },
  flipCard:{
    borderWidth: 0,
  },
  baseText: {
    color: "#3c4464",
    backgroundColor: "transparent",
  },
  placeholder: {
    color: "#a2aab1",
  },
  numberLabel: {
    fontSize: 12,
    position: "absolute",
    top: 80,
    left: 18,
  },
  number: {
    fontSize: 18,
    position: "absolute",
    top: 94,
    left: 18,
  },
  nameLabel: {
    fontSize: 12,
    position: "absolute",
    top: 131,
    left: 18,
  },
  name: {
    fontSize: 18,
    position: "absolute",
    top: 145,
    left: 18,
  },
  expiryLabel: {
    fontSize: 12,
    position: "absolute",
    top: 131,
    left: 250
  },
  expiry: {
    fontSize: 18,
    position: "absolute",
    top: 145,
    left: 250,
  },
  amexCVC: {
    fontSize: 16,
    position: "absolute",
    top: 73,
    right: 30,
  },
  cvcLabel:{
    fontSize: 12,
    position: "absolute",
    top: 86,
    left: 263
  },
  cvc: {
    fontSize: 18,
    position: "absolute",
    top: 100,
    left: 263,
  }
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CardView extends Component {
  static propTypes = {
    focused: PropTypes.string,

    brand: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.string,
    expiry: PropTypes.string,
    cvc: PropTypes.string,
    placeholder: PropTypes.object,

    scale: PropTypes.number,
    fontFamilyLabel: PropTypes.string,
    fontFamilyField: PropTypes.string,
    imageFront: PropTypes.number,
    imageBack: PropTypes.number,
    customIcons: PropTypes.object,
  };

  static defaultProps = {
    name: "",
    placeholder: {
      number: "XXXX XXXX XXXX XXXX",
      name: "Card Holder Name",
      expiry: "MM/YY",
      cvc: "",
    },

    scale: 1,
    fontFamilyLabel: Platform.select({ ios: "Courier", android: "monospace" }),
    fontFamilyField: Platform.select({ ios: "Courier", android: "monospace" }),
    imageFront: require("../images/card-front.png"),
    imageBack: require("../images/card-back.png"),
  };

  render() {
    const { focused,
      brand, name, number, expiry, cvc, customIcons,
      placeholder, imageFront, imageBack, scale, fontFamilyLabel, fontFamilyField } = this.props;

    const Icons = { ...defaultIcons, ...customIcons };
    const isAmex = brand === "american-express";
    const shouldFlip = !isAmex && focused === "cvc" && !this.props.okPressed
    const containerSize = { ...BASE_SIZE, height: BASE_SIZE.height  * scale};
    const transform = { transform: [
      { scale },
      { translateY: ((BASE_SIZE.height * (scale - 1) / 2)) },
    ] };

    return (
      <View style={[s.cardContainer, containerSize]}>
        <FlipCard style={s.flipCard}
            flipHorizontal
            flipVertical={false}
            friction={10}
            perspective={2000}
            clickable={false}
            flip={shouldFlip}>
          <ImageBackground
              style={s.cardFaceContainer}
              imageStyle={[BASE_SIZE, s.cardFace]}
              source={imageFront}>
              <Image style={[s.icon]}
                  source={Icons[brand]} />
              <Text style={[s.baseText, { fontFamily: fontFamilyLabel }, s.numberLabel, s.placeholder]}>
                Card Number
              </Text>
              <Text style={[s.baseText, { fontFamily: fontFamilyField }, s.number, !number && s.placeholder]}>
                { !number ? placeholder.number : number }
              </Text>
              <Text style={[s.baseText, { fontFamily: fontFamilyLabel }, s.nameLabel, s.placeholder]}>
                Card Holder
              </Text>
              <Text style={[s.baseText, { fontFamily: fontFamilyField }, s.name, !name && s.placeholder]}
                  numberOfLines={1}>
                { !name ? placeholder.name : name.toUpperCase() }
              </Text>
              <Text style={[s.baseText, { fontFamily: fontFamilyLabel }, s.expiryLabel, s.placeholder]}>
                Expiry
              </Text>
              <Text style={[s.baseText, { fontFamily: fontFamilyField }, s.expiry, !expiry && s.placeholder]}>
                { !expiry ? placeholder.expiry : expiry }
              </Text>
              { isAmex &&
                  <Text style={[s.baseText, { fontFamily: fontFamilyLabel }, s.amexCVC, !cvc && s.placeholder, focused === "cvc" && s.focused]}>
                    { !cvc ? placeholder.cvc : cvc }
                  </Text> }
          </ImageBackground>
          <ImageBackground
              style={s.cardFaceContainer}
              imageStyle={[BASE_SIZE, s.cardFace, transform]}
              source={imageBack}>
              <Text style={[s.baseText, { fontFamily: fontFamilyLabel }, s.cvcLabel, s.placeholder]}>
                CCV
              </Text>
              <Text style={[s.baseText, s.cvc, !cvc && s.placeholder, focused === "cvc" && s.focused]}>
                { !cvc ? placeholder.cvc : cvc }
              </Text>
          </ImageBackground>
        </FlipCard>
      </View>
    );
  }
}
