import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactNative, {
  NativeModules,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";

import CreditCard from "./CardView";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const s = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    marginLeft: 0,
  },
  inputLabel: {
    fontWeight: "bold",
  },
  input: {
    height: 40,
  },
});

const windowWidth = Dimensions.get("window").width


const CVC_INPUT_WIDTH = windowWidth;
const EXPIRY_INPUT_WIDTH = CVC_INPUT_WIDTH;
const CARD_NUMBER_INPUT_WIDTH_OFFSET = 40;
const CARD_NUMBER_INPUT_WIDTH = windowWidth;
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH;
const PREVIOUS_FIELD_OFFSET = 0;
const POSTAL_CODE_INPUT_WIDTH = 120;


/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    labelStyle: Text.propTypes.style,
    inputStyle: Text.propTypes.style,
    inputContainerStyle: View.propTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamilyLabel: PropTypes.string,
    cardFontFamilyField: PropTypes.string,
    cardBrandIcons: PropTypes.object,

    allowScroll: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: "CARDHOLDER'S NAME",
      number: "CARD NUMBER",
      expiry: "EXPIRY",
      cvc: "CVC/CCV",
      postalCode: "POSTAL CODE",
    },
    placeholders: {
      name: "Full Name",
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
      postalCode: "34567",
    },
    inputContainerStyle: {
      borderBottomWidth: 1,
      borderBottomColor: "black",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    allowScroll: false,
    additionalInputsProps: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focus = field => {
    if (!field) return;

    const scrollResponder = this.refs.Form.getScrollResponder();
    const nodeHandle = ReactNative.findNodeHandle(this.refs[field]);

    NativeModules.UIManager.measureLayoutRelativeToParent(nodeHandle,
      e => { throw e; },
      x => {
        scrollResponder.scrollTo({ x: Math.max(x - PREVIOUS_FIELD_OFFSET, 0), animated: true });
        this.refs[field].focus();
      });
  }

  _inputProps = field => {
    const {
      inputStyle, labelStyle, validColor, invalidColor, placeholderColor,
      placeholders, labels, values, status,
      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputsProps, inputLabelContainerStyle
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      labelStyle: [s.inputLabel, labelStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      label: labels[field],
      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid, inputLabelContainerStyle,

      additionalInputProps: additionalInputsProps[field],
    };
  };

  _renderScrollView(okPressed){
    const {
      allowScroll,
      inputContainerStyle,
      requiresName,
      requiresCVC,
      requiresPostalCode
    } = this.props;

    if (okPressed){
      return null
    }
    return (
      <ScrollView ref="Form"
        horizontal
        keyboardShouldPersistTaps="always"
        scrollEnabled={allowScroll}
        showsHorizontalScrollIndicator={false}
        style={s.form}>
      <CCInput
        {...this._inputProps("number")}
        containerStyle={[s.inputContainer, { width: CARD_NUMBER_INPUT_WIDTH }, inputContainerStyle]}
        inputCustomStyle={{minWidth: Dimensions.get('window').width - 50}}
      />
      { requiresName &&
        <CCInput {...this._inputProps("name")}
            keyboardType="default"
            containerStyle={[s.inputContainer, { width: NAME_INPUT_WIDTH }, inputContainerStyle]}
            inputCustomStyle={{minWidth: Dimensions.get('window').width - 50}}
      /> }
      <CCInput
        {...this._inputProps("expiry")}
        containerStyle={[s.inputContainer, { width: EXPIRY_INPUT_WIDTH }, inputContainerStyle]}
        inputCustomStyle={{minWidth: Dimensions.get('window').width / 3}}
      />
      {
        requiresCVC &&
        <CCInput
          {...this._inputProps("cvc")}
          containerStyle={[s.inputContainer, { width: CVC_INPUT_WIDTH }, inputContainerStyle]}
          inputCustomStyle={{minWidth: Dimensions.get('window').width / 3}}
        />
      }

      { requiresPostalCode &&
        <CCInput {...this._inputProps("postalCode")}
            containerStyle={[s.inputContainer, { width: POSTAL_CODE_INPUT_WIDTH }, inputContainerStyle]} /> }
      </ScrollView>
    )
  }

  render() {
    const {
      cardImageFront, cardImageBack, inputContainerStyle,
      values: { number, expiry, cvc, name, type }, focused,
      allowScroll, requiresName, requiresCVC, requiresPostalCode,
      cardScale, cardFontFamilyLabel, cardFontFamilyField, cardBrandIcons,
      inputLabelContainerStyle
    } = this.props;

    const windowWidth = Dimensions.get("window").width

    return (
      <View style={s.container}>
        <CreditCard focused={focused}
          brand={type}
          scale={cardScale}
          fontFamilyLabel={cardFontFamilyLabel}
          fontFamilyField={cardFontFamilyField}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          name={requiresName ? name : " "}
          number={number}
          expiry={expiry}
          cvc={cvc}
          okPressed={this.props.okPressed}
        />
        { this._renderScrollView(this.props.okPressed) }
      </View>
    );
  }
}
