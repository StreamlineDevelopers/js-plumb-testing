import React, { useCallback, useEffect, useState } from 'react';
import { jsPlumb } from 'jsplumb';

// ui
import Another from './Another';

const AnotherContainer = () => {
	const [jsPlumbState, setjsPlumbState] = useState(null);

	//#region //* JS PLUMB LOGIC FOR CONTENT 2
	const initializeJsPlumb2 = useCallback(() => {
		const jsPlumbDefaultOptions = {
			Endpoints: [['Dot', { radius: 13 }, 'Blank']],
			EndpointStyle: { width: 25, height: 21, fill: '#666', strokeWidth: 10 },
			EndpointHoverStyle: { fill: '#FF6600' },
			ConnectionOverlays: [
				[
					'Label',
					{
						id: 'label',
						cssClass: 'connection-label',
						visible: true,
					},
				],
			],
		};

		const jsPlumbInstance = jsPlumb.getInstance(jsPlumbDefaultOptions);

		setjsPlumbState(jsPlumbInstance);

		setDraggables(jsPlumbInstance, '.another--section');
		setDroppables(jsPlumbInstance, '.app__right');

		return jsPlumbInstance;
	}, []);

	/**
	 * @param {Instance} jsPlumbInstance
	 * @param {String} selector
	 */
	const setDraggables = (jsPlumbInstance, selector) => {
		const querySections = document.querySelectorAll(selector);

		jsPlumbInstance.draggable(querySections, {
			drag: function () {
				jsPlumbInstance.repaintEverything();
			},
		});
	};

	const setDroppables = (jsPlumbInstance, selector) => {
		const querySections = document.querySelectorAll(selector);

		jsPlumbInstance.droppable(querySections, {
			drop: function (event) {
				console.log(event.drop.params);
			},
		});
	};

	useEffect(() => {
		initializeJsPlumb2();

		return () => {
			initializeJsPlumb2();
		};
	}, [initializeJsPlumb2]);

	return <Another />;
};

export default AnotherContainer;
