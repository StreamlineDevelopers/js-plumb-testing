import React, { useCallback, useEffect, useState } from 'react';
import { jsPlumb } from 'jsplumb';

// ui
import App from './App.js';

// sample data
import SampleData from './sampleData.json';

// notification
import notification from './components/notification/notification';

const AppContainer = () => {
	const [jsPlumbState, setjsPlumbState] = useState(null);
	const [connectionInput, setConnectionInput] = useState('');

	//#region //* JS PLUMB FUNCTIONS
	const initializeJsPlumb = useCallback(() => {
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

		jsPlumbInstance.setContainer('app-container');

		setDraggables(jsPlumbInstance, 'section');

		setjsPlumbState(jsPlumbInstance);

		return jsPlumbInstance;
	}, []);

	/**
	 * @param {Instance} jsPlumbInstance
	 * @param {String} selector
	 */
	const setDraggables = (jsPlumbInstance, selector) => {
		const sectionIds = [];
		const querySections = document.querySelectorAll(selector);
		querySections.forEach((section) => sectionIds.push(section.id));
		sectionIds.forEach((id) => jsPlumbInstance.draggable(id, { containment: true }));
	};

	/**
	 * @param {Instance} jsPlumbInstance
	 * @param {Array} data
	 */
	const jsPlumbEndpoints = (jsPlumbInstance, data = null) => {
		jsPlumbInstance.registerConnectionTypes({
			'gray-connection': {
				paintStyle: { stroke: '#6666669c', strokeWidth: 10 },
				hoverPaintStyle: { stroke: '#FF6600', strokeWidth: 15 },
			},
		});

		const endPointOptions = {
			connector: ['Flowchart', { stub: [10, 0], gap: 5, cornerRadius: 10, alwaysRespectStubs: true }],
			connectionType: 'gray-connection',
			onMaxConnections: (data, e) => {
				notification(
					'error',
					'topLeft',
					'Connection Error:',
					`Max connection allowed limit exceeded. (${data.maxConnections})`
				);
			},
		};

		data &&
			data.forEach((data) => {
				let newEndPointOptionHolder;

				if (data.identifier === 'left') {
					newEndPointOptionHolder = {
						...endPointOptions,
						isSource: true,
						maxConnections: 2,
					};
				} else {
					newEndPointOptionHolder = {
						...endPointOptions,
						isTarget: true,
						maxConnections: -1,
					};
				}

				jsPlumbInstance.addEndpoint(data.element, data.option, newEndPointOptionHolder);
			});
	};

	/**
	 * @param {Instance} jsPlumbInstance
	 */
	const jsPlumbActions = (jsPlumbInstance) => {
		jsPlumbInstance.bind('connection', (data, e) => {
			const { connection, sourceId } = data;
			const parameters = connection.getParameters();

			connection.getOverlay('label').setLabel(sourceId);

			eval(parameters.run);
			// console.log(parameters);
		});

		jsPlumbInstance.bind('dblclick', (data, e) => {
			const { sourceId } = data;
			jsPlumbInstance.deleteConnectionsForElement(sourceId);
		});

		jsPlumbInstance.bind('contextmenu', function (data, e) {
			//Connect the mouse to the right click event
		});
	};

	//#endregion

	//#region //* BUTTONS
	const onConnectionInputChange = (e) => {
		setConnectionInput(e.target.value);
	};

	const onAddConnectionClick = () => {
		const data = connectionInput.split(',');
		const option = {
			anchors: ['RightMiddle', 'LeftMiddle'],
			endpoints: ['Dot', 'Blank'],
		};

		if (data.length !== 2)
			return notification('error', 'topLeft', 'Input Error:', 'Separate srcid and targetid with a comma');

		jsPlumbState.connect({ source: data[0], target: [data[1]] }, option);
	};

	const onDeleteConnectionClick = () => {
		jsPlumbState.deleteConnectionsForElement(connectionInput);
	};

	const onDeleteElementClick = (e) => {
		jsPlumbState.remove(connectionInput);
	};

	const onResetConnectionClick = () => {
		jsPlumbState.deleteEveryConnection();
	};

	//#endregion

	//#region //* JS PLUMB USE EFFECT
	useEffect(() => {
		const jsPlumbInstance = initializeJsPlumb();

		jsPlumbEndpoints(jsPlumbInstance, SampleData[0].left);
		jsPlumbEndpoints(jsPlumbInstance, SampleData[1].right);

		jsPlumbActions(jsPlumbInstance);

		return () => {
			initializeJsPlumb();
			jsPlumbEndpoints();
			jsPlumbActions();
		};
	}, [initializeJsPlumb]);

	//#endregion

	return (
		<App
			onResetConnectionClick={onResetConnectionClick}
			connectionInput={connectionInput}
			onConnectionInputChange={onConnectionInputChange}
			onAddConnectionClick={onAddConnectionClick}
			onDeleteConnectionClick={onDeleteConnectionClick}
			onDeleteElementClick={onDeleteElementClick}
		/>
	);
};

export default AppContainer;
