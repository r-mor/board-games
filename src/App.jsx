import * as React from 'react';

//Data
const initialBoardGameList = [
  {
    title: 'Deception Murder in Hong Kong',
    url: 'https://www.boardgames.ca/deception-murder-in-hong-kong-board-game.html',
    designer: null,
    publisher: 'Grey Fox Games',
    score: 9.5,
    objectId: 1
  },
  {
    title: 'Cosmic Encounter',
    url: 'https://www.fantasyflightgames.com/en/products/cosmic-encounter/',
    designer: null,
    publisher: 'Fantasy Flight Games',
    score: 10.0,
    objectId: 2
  },
  {
    title: 'Dominion',
    url: 'https://www.riograndegames.com/games/dominion/',
    designer: null,
    publisher: 'Rio Grande Games',
    score: 8.5,
    objectId: 3
  },
  {
    title: 'Ark Nova',
    url: 'https://capstone-games.com/board-games/ark-nova/',
    designer: null,
    publisher: 'Capstone Games',
    score: 9.0,
    objectId: 4
  },
  {
    title: 'Mindbug',
    url: 'https://mindbug.me/',
    designer: null,
    publisher: 'Nerdlab Games',
    score: 8.5,
    objectId: 5
  },
  {
    title: 'Monopoly',
    url: 'https://shop.hasbro.com/en-ca/parentkid?brand=monopoly',
    designer: null,
    publisher: 'Hasbro',
    score: 5.5,
    objectId: 6
  }
];

const useStorageState = (initialState, key) => {
  const[searchTerm, setSearchTerm] = React.useState(localStorage.getItem('boardGameSearch') || initialState);

  React.useEffect(() => {
    localStorage.setItem(key, searchTerm)
  }, [searchTerm]);

  return [searchTerm, setSearchTerm]
}

const getAsyncBoardGames = () =>
new Promise((resolve) =>
  setTimeout(
    () => resolve(
      { 
        data: 
        { 
          boardGames: initialBoardGameList
        }
      }
    ),
    2000
  )
);


const boardGamesReducer = (state, action) => {
  switch(action.type){
    case 'SET_BOARDGAMES':
      return action.payload;
    case 'REMOVE_BOARDGAME':
      return state.filter(
        (boardGame) => action.payload.objectId !== boardGame.objectId
      );
    default:
      throw new Error();
  }
}


//Components

const App = () => {
  const title = 'My Boardgames'

  //const [boardGames, setBoardGames] = React.useState([]);

  const [boardGames, dispatchBoardGames] = React.useReducer(
    boardGamesReducer,
    []
  )

  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);



  React.useEffect(() => {
    setIsLoading(true);

      getAsyncBoardGames()
        .then((result) => {
            dispatchBoardGames({
            type: 'SET_BOARDGAMES',
            payload: result.data.boardGames
          });
        setIsLoading(false);
      })
      .catch(() => setIsError(true))
  }, []);
  
  const [searchTerm, setSearchTerm] = useStorageState('', 'boardGameSearch')

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleRemoveBoardGame = (item) => {
    dispatchBoardGames({
      type: 'REMOVE_BOARDGAME',
      payload: item,
    });
  };

  const boardGameSearch = boardGames.filter(
    boardGame => boardGame.title.toLocaleLowerCase().includes(searchTerm.toLowerCase())
  )
  

  return (
    <>
      <h2>{title}</h2>
      <InputWithLabel 
        id = 'search'
        type = 'text'
        isFocused={true}
        onChange={handleSearch} value={searchTerm}>
          <b>Search for: </b>
      </InputWithLabel>
      
      {isError && <p>Something went wrong ...</p>}

      {isLoading ? (<p>Is Loading...</p>) : (
        <List list={boardGameSearch} onRemoveItem={handleRemoveBoardGame}/>
      )}
      
      <SearchForMindbugButton onChange={setSearchTerm}/>
      <RandomNumberButton />
    </>
  )
}

const List = ({list, onRemoveItem}) => {

  return (
    <>
    <ul>
      {list.map(item =>
        <li key={item.objectId}>
          <ListItem 
            item={item}
            onRemoveItem={onRemoveItem}
          />
        </li>
      )}
    </ul>
    <hr/>
    </>
  )
}

const ListItem = ({item, onRemoveItem}) => {

  return(
    <>
      <button onClick={onRemoveItem.bind(null, item)}>Remove</button> &nbsp;
      <span>{item.title}</span> &nbsp;
      <span>{item.publisher}</span> &nbsp;
      <span>{item.score}</span> &nbsp;
    </>
  )
}

const InputWithLabel = ({id, type, value, onChange, isFocused, children}) => {

  return(
  <>
    <div>
      <label htmlFor={id}>{children}</label>
      <input id={id} type={type} value={value} onChange={onChange} autoFocus={isFocused}/>
      <p>[{value}]</p>
    </div>
  </>
  )
} 

const SearchForMindbugButton = ({onChange}) =>{
  const [counter, setCounter] = React.useState(0);
  return(
    <>
      <button onClick={() => {
          onChange('Mindbug'); 
          setCounter(counter +1)
        }
      }>
        MindBug #{counter}!
      </button>
    </>
  )
}

const RandomNumberButton = () => {
  const getRandomNumber = () => (
    Math.floor(Math.random() * 100) + 1
  );

  const [randomNumber, setRandomNumber] = React.useState(getRandomNumber());
  const [isLoadingNumber, setIsLoadingNumber] = React.useState(false);

  const handleRandom = () => {
    setIsLoadingNumber(true);
    getAsyncRandomNumber().then(
      result => {
        setRandomNumber(result.data.number);
      }
    ).catch(result => {
        setRandomNumber(result);
      }
    ).finally(() => {
        setIsLoadingNumber(false);
      }
    )
  }
  
  const getAsyncRandomNumber = () => (
    new Promise((resolve, reject) => {
      const success = true;
      setTimeout(() => {
        if(success){
          resolve (
            { 
              data:
              {number: getRandomNumber()}
            })
        }else{
          reject ('Unsuccessful')
        }
      }, 2000)
    })
  )

  return(
    <>
      <button onClick={() => {handleRandom()}}>
        {isLoadingNumber? 'Loading...' : randomNumber}
      </button>
    </>
  )
}

export default App




