import React, {Component, cloneElement, Fragment} from 'react';
import classNames from 'classnames';
import schema from 'async-validator';
import {isEmpty} from 'lodash';

import './index.less';

const validate = (rules, entity, callback) => {
  let validator = new schema(rules);
  console.log(entity, '------ddddd----dd---validate');
  validator.validate(entity, (errors, fields) => {
    callback(errors, entity);
  });
};

export default class Form extends Component {

  onSubmit = (e) => {
    e.preventDefault();
    let {
      onSubmit
    } = this.props;
    onSubmit && onSubmit(e);
    return false;
  };

  render() {
    let {
      className,
      onSubmit,
      ...rest
    } = this.props;
    return <form {...rest} onSubmit={this.onSubmit}/>
  }
};

Form.Item = ({label, className, children}) => {
  return (
    <div className={classNames('fengyu-item', className)}>
      <label>{label}</label>
      {children}
    </div>
  )
};

Form.create = (WrapperComponent) => {
  return class FormWrapper extends Component {

    rules = {};

    error = [];

    validateFields = (fields, callback) => {
      fields = fields || Object.keys(this.rules);
      let valueMap = {};
      fields.forEach((key) => {
        valueMap[key] = document.getElementById(key).value
      });

      validate(this.getRules(fields), valueMap, (errs, values) => {
        this.error = errs;
        this.forceUpdate();
        callback && callback(errs, values)
      })
    };

    addRules = (name, rules) => {
      if (rules) {
        this.rules[name] = rules;
      }
    };

    getRules = (fields = {}) => {
      let allRules = {};
      fields.forEach((field) => {
        allRules[field] = this.rules[field];
      });

      return isEmpty(allRules) ? this.rules : allRules;
    };

    onChange = (before, name, callback) => {
      return (e) => {
        before && before(e);
        this.validateFields([name], callback);
      }
    };

    getError = (name) => {
      return (this.error || []).filter((item) => {
        return item.field === name;
      }).map((item) => {
        return item.message
      }).join(',')
    };

    getFieldDecorator = (name, fieldOption = {}) => {
      this.addRules(name, fieldOption.rules);

      let error = this.getError(name);
      return (fieldElem) => {

        let callback = (err = []) => {

        };
        let {
          onChange
        } = fieldElem;
        let newProps = {
          onChange: this.onChange(null, name, callback)
        };
        if (onChange) {
          newProps.onChange = this.onChange(onChange, name, callback)
        }
        return (
          <Fragment>
            {
              cloneElement(fieldElem, {
                id: name,
                ...newProps,
                error: !!error
              })
            }
            {
              error &&
              <span style={{color: 'red', marginTop: '5px'}}>{error}</span>
            }
          </Fragment>
        )
      }
    };

    render() {
      return (
        <WrapperComponent
          {...this.props}
          form={{
            'validateFields': this.validateFields,
            'getFieldDecorator': this.getFieldDecorator
          }}
        />
      )
    }
  }
};