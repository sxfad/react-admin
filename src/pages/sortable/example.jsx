import React, {useState} from 'react'
import Card from './Card'
import update from 'immutability-helper'

const style = {
    width: 400,
}
const Container = () => {
    {
        const [cards, setCards] = useState([
            {
                id: 1,
                text: 'Write a cool JS library',
            },
            {
                id: 2,
                text: 'Make it generic enough',
            },
            {
                id: 3,
                text: 'Write README',
            },
            {
                id: 4,
                text: 'Create some examples',
            },
            {
                id: 5,
                text:
                    'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
            },
            {
                id: 6,
                text: '???',
            },
            {
                id: 7,
                text: 'PROFIT',
            },
        ]);
        const moveCard = (dragIndex, hoverIndex, position) => {
            console.log(dragIndex, hoverIndex, position);
            // const dragCard = cards[dragIndex];
            // setCards(
            //     update(cards, {
            //         $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
            //     }),
            // )
        };
        return (
            <div style={style}>
                {cards.map((card, i) => (
                    <Card
                        direction="vertical"
                        key={card.id}
                        index={i}
                        id={card.id}
                        onMove={moveCard}
                    >
                        {card.text}
                    </Card>
                ))}
            </div>
        )
    }
};
export default Container
