import React, {Component} from 'react';

import Form from '@components/Form';

@Form.create
class Example extends Component {
  render() {

    let {
      form
    } = this.props;

    let {getFieldDecorator, validateFields} = form;


    return (
      <Form
        onSubmit={(e) => {
          validateFields(null, (err, values) => {
            console.log(err, values, '------------');
          });
          console.log('---ss-dsdsssss=====xxxdds-', e);
        }}
      >
        <Form.Item label="name">
          {
            getFieldDecorator('name', {
              rules: [
                {required: true, message: '必填'},
                {type: 'integer', message: '请输入数字'}
              ]
            })(
              <input/>
            )
          }
        </Form.Item>
        <Form.Item label="age">
          {
            getFieldDecorator('age', {
              rules: [
                {required: true, message: 'Please input your age!'}
              ]
            })(
              <input/>
            )
          }
        </Form.Item>
        <button htmlType="submit">submit</button>
      </Form>
    )
  }
}

export default class App extends Component {
  render() {
    return (
      <div>
        App
        <Example/>
      </div>
    )
  }
}
