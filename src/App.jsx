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
new Promise((resolve, reject) =>
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
    case 'BOARDGAMES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'BOARDGAMES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case 'BOARDGAMES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_BOARDGAME':
      return {
        ...state,
        data: state.data.filter(
          (boardGame) => action.payload.objectId !== boardGame.objectId
        ),
      }

    default:
      throw new Error();
  }
}


//Components

const App = () => {
  const title = 'My Boardgames'

  const [boardGames, dispatchBoardGames] = React.useReducer(
    boardGamesReducer,
    {data: [], isLoading: false, isError: false }
  )

  React.useEffect(() => {
    dispatchBoardGames({ type: 'BOARDGAMES_FETCH_INIT' });

      getAsyncBoardGames()
        .then((result) => {
          dispatchBoardGames({ type: 'BOARDGAMES_FETCH_SUCCESS', payload: result.data.boardGames });
      })
      .catch(() => dispatchBoardGames({ type: 'BOARDGAMES_FETCH_FAILURE' }))
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

  const boardGameSearch = boardGames.data.filter(
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
      
      {boardGames.isError && <p>Something went wrong ...</p>}

      {boardGames.isLoading ? (<p>Is Loading...</p>) : (
        <List list={boardGameSearch} onRemoveItem={handleRemoveBoardGame}/>
      )}
      
      <SearchForMindbugButton onChange={setSearchTerm}/>
      <RandomNumberButton />
      <hr/>
      <WeekList />

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


const WeekList = () => {
  const week = ['Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const week2 = ['Monday2','Tuesday2', 'Wednesday2', 'Thursday2', 'Friday2', 'Saturday2', 'Sunday2'];

  const weekReducer = (state, action) => {
    switch(action.type){
      case ACTIONS.SET_WEEK:
        return action.payload;
      case ACTIONS.SET_WEEK2:
        return week2;
      case ACTIONS.REVERSE_WEEK:
        return state.slice().reverse();
      case ACTIONS.RESET_WEEK:
        return week;
      case ACTIONS.DELETE_DAY:
          return state.filter(i => i !== action.payload);
      default:
        throw new Error();
    }
  }

  const ACTIONS ={
    SET_WEEK: 'SET_WEEK',
    SET_WEEK2: 'SET_WEEK2',
    REVERSE_WEEK: 'REVERSE_WEEK',
    RESET_WEEK: 'RESET_WEEK',
    DELETE_DAY: 'DELETE_DAY',
  }

  const[weekList, dispatchWeek] = React.useReducer(weekReducer, week);

  //const [weekList, setWeekList] = React.useState(week);
  
  const deleteDay = (item) => {
    dispatchWeek(
      {
        type: ACTIONS.DELETE_DAY,
        payload: item
      }
    );
  }

  return(
    <>
      <ul>
        {
          weekList.map((item) => 
          <li key={item}>
            <WeekListItem item={item} onDelete={deleteDay}/>
          </li>
          
          )
        }
      </ul>
      <button onClick={()=> dispatchWeek({ type: ACTIONS.RESET_WEEK })}>Reset days</button>
      <button onClick={()=> dispatchWeek({ type: ACTIONS.REVERSE_WEEK })}>Reverse</button>
      <button onClick={()=> dispatchWeek({ type: ACTIONS.SET_WEEK2 })}>Switch</button>
    </>
  )
}

const WeekListItem = ({item, onDelete}) =>(
  <>
    <button onClick={() => onDelete(item)}>Remove</button>
    <span>&nbsp;{item}</span>
  </>
)

export default App




