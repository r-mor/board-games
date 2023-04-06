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
//Components

const App = () => {
  const title = 'My Boardgames'
  const [boardGames, setBoardGames] = React.useState(initialBoardGameList);
  
  const [searchTerm, setSearchTerm] = useStorageState('World', 'boardGameSearch')

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleRemoveBoardGame = (item) => {
    const newBoardGames = boardGames.filter(
      (boardGame) => item.objectId !== boardGame.objectId
    )

    setBoardGames(newBoardGames);
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

      <List list={boardGameSearch} onRemoveItem={handleRemoveBoardGame}/>
      <SearchForMindbugButton onChange={setSearchTerm}/>
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

export default App
