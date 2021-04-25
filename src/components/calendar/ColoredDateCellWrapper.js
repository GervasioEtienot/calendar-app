import React, {Children} from 'react';
import moment from 'moment';


const CURRENT_DATE = moment().toDate();

export const ColoredDateCellWrapper = ({children, value}) =>{
	return React.cloneElement(Children.only(children), {
		style: {
			...children.style,
			// backgroundColor: value < CURRENT_DATE ? 'lightgreen' : 'lightblue',
		},
	})};