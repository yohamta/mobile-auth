import React from 'react';
import { Component } from 'react';
import { View } from 'react-native';
import { Transition } from 'react-navigation-fluid-transitions';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import {
  Content,
  Card,
  CardItem,
  Body,
  Form,
  Label,
  Button,
  Left,
  Text,
} from 'native-base';
import { connect } from 'react-redux';
import { signUp } from '../../actions';
import { validateEmail } from '../../utils/Validator';
import styles from './styles';
import InputItem from '../../components/Auth/InputItem';
import PrimaryButton from '../../components/common/PrimaryButton';

const validate = values => {
  const error = {};
  error.username = '';
  error.email = '';
  error.password = '';
  var un = values.username;
  var em = values.email;
  var pw = values.password;
  var pwc = values.passwordConfirm;
  if (values.username === undefined) {
    un = '';
  }
  if (values.email === undefined) {
    em = '';
  }
  if (values.password === undefined) {
    pw = '';
  }
  if (values.passwordConfirm === undefined) {
    pwc = '';
  }
  if (un.length > 15 && un !== '') {
    error.username = 'Username must be less than 15 char';
  }
  if (pw.length < 8 && pw !== '') {
    error.password = 'Password is too short';
  }
  if (pw !== pwc) {
    error.passwordConfirm = 'Password is not matched';
  }
  if (em !== '' && validateEmail(em) === false) {
    error.email = 'Email format is invalid!';
  }
  return error;
};

class SignUpScreen extends Component {
  onSubmit(values) {
    if (values.username === undefined || values.username === '') {
      throw new SubmissionError({
        email: 'Please Input Username',
        _error: 'Sign up Failed !',
      });
    }
    if (values.email === undefined || values.email === '') {
      throw new SubmissionError({
        email: 'Please Input E-mail Address',
        _error: 'Sign up Failed !',
      });
    }
    if (values.password === undefined || values.password === '') {
      throw new SubmissionError({
        password: 'Please Input Password',
        _error: 'Sign up Failed !',
      });
    }
    this.props.signUp(values, this.props.navigation);
  }

  renderError(error) {
    if (error === undefined || error === null || error === '') {
      return <View />;
    }
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  render() {
    const { error, signUpError } = this.props;
    return (
      <Content padder>
        <Card>
          <CardItem header bordered>
            <Left>
              <Body>
                <Transition shared="authTitle">
                  <View>
                    <Text>Welcome,</Text>
                    <Text note>Please Sign in to continue</Text>
                  </View>
                </Transition>
              </Body>
            </Left>
          </CardItem>
          <CardItem bordered>
            <Body>
              <Form style={{ alignSelf: 'stretch' }}>
                <Field
                  name={'username'}
                  component={InputItem}
                  label="Username"
                />
                <Field name={'email'} component={InputItem} label="E-mail" />
                <Field
                  name={'password'}
                  component={InputItem}
                  label="Password"
                  secureTextEntry
                />
                <Field
                  name={'passwordConfirm'}
                  component={InputItem}
                  label="Password Comfirm"
                  secureTextEntry
                />
              </Form>
              <Transition shared="authSubmitButton">
                <View>
                  <PrimaryButton
                    onPress={this.props.handleSubmit(this.onSubmit.bind(this))}
                    loading={this.props.loading}
                    text="Sign Up"
                  />
                </View>
              </Transition>
              {this.renderError(error)}
              {this.renderError(signUpError)}
            </Body>
          </CardItem>
          <CardItem bordered>
            <Body>
              <Label style={styles.noticeLabelStyle}>
                Do you have an account already ?
              </Label>
              <Button
                bordered
                style={styles.singupButtonStyle}
                onPress={() => {
                  this.props.navigation.navigate('SignIn');
                }}
              >
                <Text style={styles.singupButtonLabelStyle}>Sign in</Text>
              </Button>
            </Body>
          </CardItem>
        </Card>
      </Content>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  signUpError: state.auth.signUpError,
});

const connected = connect(
  mapStateToProps,
  { signUp }
)(SignUpScreen);
export default reduxForm({ form: 'signIn', validate })(connected);
