import React from 'react';
import { connect } from 'react-redux';
import { addFavoriteTerm, removeFavoriteTerm } from './actions';

const mapStateToProps = state => {
    return {
        terms: state.terms,
        favorites: state.favorites
    };
};


class JargonList extends React.Component {

    state = {
        showFavorites: false
    }


    toggleFavorites() {
        this.setState({ showFavorites: true });
    }
    toggleJargon() {
        this.setState({ showFavorites: false });
    }
    render() {
        if (this.state.showFavorites) {

            return (
                <div>
                    <h1>
                        JS Jargon
                </h1>
                    <div>
                        <button onClick={() => { this.toggleJargon() }} > Show Jargon</button>
                    </div>
                    <div>
                        {this.props.favorites.map((term, index) => {
                            return (
                                <div key={index}>
                                    <h1> {term.name}</h1>
                                    <p> {term.description}</p>
                                    <button onClick={() => this.props.dispatch(removeFavoriteTerm(term.name))}>
                                        Remove from favorites
                        </button>

                                </div>
                            );
                        })}                </div>
                </div>
            )
        }
        else
            return (
                <div>
                    <h1>
                        JS Jargon
                </h1>
                    <div>
                        <button onClick={() => { this.toggleFavorites() }} > Show Favorites</button>
                    </div>
                    {this.props.terms.map((term, index) => {
                        return (
                            <div key={index} >
                                <h1> {term.name} </h1>
                                <p> {term.description}</p>
                                <button onClick={() => this.props.dispatch(addFavoriteTerm({ name: term.name, description: term.description }))}>
                                    Add to favorites
                        </button>


                            </div>
                        );
                    })}

                </div>
            )
    }
}
export default connect(mapStateToProps, null)(JargonList);