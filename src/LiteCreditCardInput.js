import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  Image,
  LayoutAnimation,
  TouchableOpacity,
} from "react-native";

import { TextInputPropTypes } from "deprecated-react-native-prop-types";

import Icons from "./Icons";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";
import theme from "~/styles/theme";


const INFINITE_WIDTH = 1000;

const s = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  viewIcon: {
    backgroundColor: "transparent",
    padding: theme.metrics.perfectSize(8),
  },
  icon: {
    width: 40,
    height: 32,
    resizeMode: "contain",
  },
  cardInput: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.metrics.perfectSize(16),
    backgroundColor: theme.$colors.background,
    borderRadius: theme.metrics.perfectSize(8),
    height: theme.metrics.baseInputHeight,
  },
  CCNumberInput: {
    backgroundColor: theme.$colors.background,
    borderRadius: theme.metrics.perfectSize(8),
    paddingLeft: theme.metrics.perfectSize(12),
    paddingRight: theme.metrics.perfectSize(12),
    height: theme.metrics.baseInputHeight,
    flex: 1,
    backgroundColor: "transparent",
  },
  viewCCNumberInput: {
    flex: 1,
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class LiteCreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,

    placeholders: PropTypes.object,

    inputStyle: TextInputPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    additionalInputsProps: PropTypes.objectOf(
      PropTypes.shape(TextInputPropTypes)
    ),
  };

  static defaultProps = {
    placeholders: {
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    additionalInputsProps: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  UNSAFE_componentWillReceiveProps = (newProps) => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focusNumber = () => this._focus("number");
  _focusExpiry = () => this._focus("expiry");

  _focus = (field) => {
    if (!field) return;
    this.refs[field].focus();
    LayoutAnimation.easeInEaseOut();
  };

  _inputProps = (field) => {
    const {
      inputStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      validColor,
      invalidColor,
      placeholderColor,
      ref: field,
      field,

      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputProps: additionalInputsProps[field],
    };
  };

  _iconToShow = () => {
    const {
      focused,
      values: { type },
    } = this.props;
    if (focused === "cvc" && type === "american-express") return "cvc_amex";
    if (focused === "cvc") return "cvc";
    if (type) return type;
    return "placeholder";
  };

  render() {
    const {
      focused,
      values: { number },
      inputStyle,
      status: { number: numberStatus },
    } = this.props;
    const showRightPart = focused && focused !== "number";

    return (
      <View style={s.container}>
        <View style={s.cardInput}>
          <CCInput
            {...this._inputProps("number")}
            keyboardType="numeric"
            inputStyle={s.CCNumberInput}
            placeholderColor={theme.$colors.neutralsDark2}
            containerStyle={s.viewCCNumberInput}
          />
          <View style={s.viewIcon}>
            <Image style={s.icon} source={Icons[this._iconToShow()]} />
          </View>
        </View>
      </View>
    );
  }
}
