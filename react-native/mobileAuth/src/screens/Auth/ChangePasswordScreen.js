import React, { Component } from 'react';
import { View } from 'react-native';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import {
  Content,
  Card,
  CardItem,
  Body,
  Form,
  Button,
  Left,
  Text,
  Spinner,
} from 'native-base';
import { connect } from 'react-redux';
import { changePassword } from '../../actions';
import styles from './styles';
import InputItem from '../../components/Auth/InputItem';

const validate = values => {
  const error = {};
  error.password = '';
  var pw = values.password;
  var pwc = values.passwordConfirm;
  if (values.password === undefined) {
    pw = '';
  }
  if (values.passwordConfirm === undefined) {
    pwc = '';
  }
  if (pw.length < 8 && pw !== '') {
    error.password = 'Password is too short';
  }
  if (pw !== pwc) {
    error.passwordConfirm = 'Password is not matched';
  }
  return error;
};

class ChangePasswordScreen extends Component {
  onSubmit(values) {
    if (values.oldPassword === undefined || values.oldPassword === '') {
      throw new SubmissionError({
        password: 'Please Input Old Password',
        _error: 'Change Password Failed !',
      });
    }
    if (values.password === undefined || values.password === '') {
      throw new SubmissionError({
        password: 'Please Input Password',
        _error: 'Change Password Failed !',
      });
    }
    this.props.changePassword(values);
  }

  renderError(error) {
    if (error === undefined || error === null || error === '') {
      return <View />;
    }
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  renderSubmitButton() {
    const { handleSubmit } = this.props;
    if (this.props.loading) {
      return (
        <Button
          block
          style={[styles.signinButtonStyle, { backgroundColor: 'orange' }]}
        >
          <Spinner color="white" size="small" />
        </Button>
      );
    }
    return (
      <Button
        block
        style={[styles.signinButtonStyle, { width: 200 }]}
        onPress={handleSubmit(this.onSubmit.bind(this))}
      >
        <Text style={styles.singinButtonLabelStyle}>Change Password</Text>
      </Button>
    );
  }

  render() {
    const { error, changePasswordError } = this.props;
    return (
      <Content padder>
        <Card>
          <CardItem bordered>
            <Body>
              <Form style={{ alignSelf: 'stretch' }}>
                <Field
                  name={'oldPassword'}
                  component={InputItem}
                  label="Old Password"
                  secureTextEntry
                />
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
              <View>{this.renderSubmitButton()}</View>
              {this.renderError(error)}
              {this.renderError(changePasswordError)}
              {this.props.changePasswordSuccess && (
                <Text style={{ color: 'green' }}>
                  Password changed successfully.
                </Text>
              )}
            </Body>
          </CardItem>
        </Card>
      </Content>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  changePasswordSuccess: state.auth.changePasswordSuccess,
  changePasswordError: state.auth.changePasswordError,
});

const connected = connect(
  mapStateToProps,
  { changePassword }
)(ChangePasswordScreen);
export default reduxForm({ form: 'changePassword', validate })(connected);
