import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import onClickOutside from 'react-onclickoutside';

import styles from './index.css';

const cx = classNames.bind(styles);

class FilterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: { secondarySelector: [], primarySelector: {} },
      selectedPrimaryItem: {},
      selectedSubItems: [],
      displayedSubItem: { subFunction: [] },
      selectedItemIds: props.selectedSubItems.map(func => func.id),
    };
  }

  componentDidMount() {
    console.log('so something saved');
  }

  handleMouseEnter(func) {
    this.setState({
      displayedSubItem: {
        functionId: func.id,
        subFunction: func.subFunction,
      },
    });
  }

  handleClickItem(func) {
    const { selectedItemIds } = this.state;
    let updatedSelectedItemIds = [];
    if (selectedItemIds.includes(func.id)) {
      updatedSelectedItemIds = selectedItemIds.filter(s => s !== func.id);
    } else {
      updatedSelectedItemIds = [...selectedItemIds, func.id];
    }
    this.setState({
      selectedItemIds: updatedSelectedItemIds,
    });
  }

  handleClickSubFunction(subfunction) {
    this.toggleSubItem(subfunction);
  }

  resetFilter = () => {
    this.setState({
      selectedSubItems: [],
    });
  };

  toggleSubItem = (subItem) => {
    const selectedSubFunctionIds = this.state.selectedSubItems.map(subItem => subItem.id);
    const toggledSubFunctionId = subItem.id;

    if (selectedSubFunctionIds.includes(toggledSubFunctionId)) {
      this.setState({
        selectedSubItems: this.state.selectedSubItems.filter(s => s.id !== toggledSubFunctionId),
      });
    } else {
      this.setState({
        selectedSubItems: [ ...this.state.selectedSubItems, subItem ],
      });
    }
  };

  toggleAllSubItems = () => {
    const subFunctionIds = this.state.displayedSubItem.subFunction.map(subItem => subItem.id);
    const currentSelectedSubFunctionIds = this.state.selectedSubItems.map(subFunction => subFunction.id);

    const isAllSelected = this.state.displayedSubItem.subFunction.every(subFunction =>
      currentSelectedSubFunctionIds.includes(subFunction.id));
    if (isAllSelected) {
      this.setState({
        selectedSubItems: this.state.selectedSubItems.filter(s => !subFunctionIds.includes(s.id)),
      })
    } else {
      this.setState({
        selectedSubItems: [ ...this.state.selectedSubItems, ...this.state.displayedSubItem.subFunction ],
      })
    }
  };

  handleClickAllMessage = () => {
    this.resetFilter();
    this.props.onOutsideClose(true);
  };

  handleClickDealerMessage = (p) => {
    this.props.onOutsideClose({ secondarySelector: this.state.selectedSubItems, primarySelector: p });
  };

  handleClearSubFunctions = () => {
    this.setState({
      displayedSubItem: { subFunction: [] },
    });
  }

  handleClickAllSubFunction(subFunctions) {
    this.toggleAllSubItems(subFunctions);
  }

  handleClickOutside = () => this.props.onOutsideClose({
    secondarySelector: this.state.selectedSubItems,
    primarySelector: this.state.selectedPrimaryItem,
  });

  handleClickFunction = (func) => {
    this.toggleSubItem(func);
    // this.handleClickItem(func);
  }

  render() {
    const { displayedSubItem } = this.state;
    const selectedSubItemIds = this.state.selectedSubItems.map(subFunction => subFunction.id);
    const isAllSelected = displayedSubItem.subFunction.every(subItem => selectedSubItemIds.includes(subItem.id));

    return (
      <div className={cx('filter-container')}>
        <div className={cx('filter-function')}>
          <span
            className={cx('function-item')}
            onClick={this.handleClickAllMessage}
            onMouseEnter={this.handleClearSubFunctions}
          >
            { this.props.allMessageText }
          </span>
          {this.props.secondaryDataSource.map((func, index) => {
            const subItemIds = func.subFunction.map(subFunction => subFunction.id);
            const isSelectedSubItemsEmpty = subItemIds.filter(s =>
              selectedSubItemIds.indexOf(s) > -1).length <= 0;
            const isFunctionHovered = displayedSubItem.functionId === func.id;
            return (
              <span
                key={index}
                className={cx('function-item',
                  { 'function-selected': !isSelectedSubItemsEmpty },
                  { hovered: isFunctionHovered })}
                onMouseEnter={() => this.handleMouseEnter(func)}
              >
                {func.name}
              </span>
            );
          },
          )}
          {
            this.props.primaryDataSource.map((p, i) => {
              return (
                <span
                  key={i}
                  className={cx('function-item', { 'function-selected': this.props.primaryDataSource })}
                  onClick={() => this.handleClickDealerMessage(p)}
                  onMouseEnter={this.handleClearSubFunctions}
                >
                { p.text }
                </span>
              )
            })
          }
        </div>
        {
          displayedSubItem.subFunction.length > 0 &&
          <div className={cx('filter-subfunction')}>
            <span
              className={cx('subfunction-item', { 'subfunction-selected': isAllSelected })}
              onClick={() => this.handleClickAllSubFunction(displayedSubItem.subFunction)}
            >
              选择全部
            </span>
            {
              displayedSubItem.subFunction.map((subFunction, index) => {
                const isSubFunctionSelected = selectedSubItemIds.includes(subFunction.id);
                return (
                  <span
                    key={index}
                    className={cx('subfunction-item', { 'subfunction-selected': isSubFunctionSelected })}
                    onClick={() => this.handleClickSubFunction(subFunction)}
                  >
                    {subFunction.name}
                  </span>
                );
              },
              )
            }
          </div>
        }
      </div>
    );
  }
}

FilterComponent.propTypes = {
  secondaryDataSource: PropTypes.array,
  selectedSubItems: PropTypes.array,
  onOutsideClose: PropTypes.func,
  primaryDataSource: PropTypes.array,
  allMessageText: PropTypes.string,
  needSavedStatus: PropTypes.bool,
};

FilterComponent.defaultProps = {
  secondaryDataSource: [],
  selectedSubItems: [],
  onOutsideClose: () => {},
  needSavedStatus: false,
  primaryDataSource: [],
};

export default onClickOutside(FilterComponent);
