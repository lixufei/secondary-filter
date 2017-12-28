import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FilterComponent from './FilterComponent.js';

class SecondaryFilter extends React.Component {

    render() {
        return (
            <div className="square">
                <FilterComponent 
                    secondaryDataSource={[
                        {
                          id: 1,
                          name: 'sales',
                          subFunction: [{
                            id: 1,
                            name: 'dealer order',
                          },
                            {
                              id: 2,
                              name: 'dealer order2222',
                            }]
                        },
                        {
                          id: 12,
                          name: 'ND',
                          subFunction: [{
                            id: 12,
                            name: 'dealer orderOOOOO',
                          },
                            {
                              id: 21,
                              name: 'dealer 3333',
                            }]
                        }
                      ]}
                      primaryDataSource={[{key: 0, text: 'dealer1'}, {key: 1, text: 'dealer2'}, {key: 2, text: 'dealer3'}]}
                      onOutsideClose={() => {}}
                      allMessageText="选择所有"
                />
            </div>
        );
    }
}

ReactDOM.render(
    <SecondaryFilter />,
    document.getElementById('root')
);