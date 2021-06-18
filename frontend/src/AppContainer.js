import React, { useCallback, useEffect, useState } from 'react';
import { jsPlumb } from 'jsplumb';

// ui
import App from './App.js';

// sample data
import SampleData from './sampleData.json';

// notification
import notification from './components/notification/notification';

// components
import AnotherContainer from './components/another/AnotherContainer.js';

const AppContainer = () => {
	const [jsPlumbState, setjsPlumbState] = useState(null);
	const [connectionInput, setConnectionInput] = useState('');

	const uuidv4 = () => {
		return (
			'xxxxxxxx-xxxx-4xxx-xxxxxxxxxxxx'.replace(/[xy]/g),
			(c) => {
				const r = (Math.random() * 16) | 0,
					v = c == 'x' ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			}
		);
	};

	//#region //* JS PLUMB LOGIC
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

		setDraggables(jsPlumbInstance, '.app__contents--section');

		setjsPlumbState(jsPlumbInstance);

		return jsPlumbInstance;
	}, []);

	/**
	 * @param {Instance} jsPlumbInstance
	 * @param {String} selector
	 */
	const setDraggables = (jsPlumbInstance, selector) => {
		const querySections = document.querySelectorAll(selector);

		jsPlumbInstance.draggable(querySections, {
			containment: true,
			// helper: 'clone',
			// appendTo: '#app__contents2-inputs',
			// getConstrainingRectangle: () => [99999, 99999],
			drag: function () {
				jsPlumbInstance.repaintEverything();
			},
		});
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

			doAlert(parameters.id);
		});

		jsPlumbInstance.bind('dblclick', (data, e) => {
			const { sourceId } = data;

			jsPlumbInstance.deleteConnectionsForElement(sourceId);
		});
	};

	const doAlert = (id) => {
		return alert(`I am from ${id}`);
	};

	//#endregion

	//#region //* BUTTONS LOGIC
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

		jsPlumbState.connect({ source: data[0], target: data[1] }, option);
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

	//#endregion
	return (
		<>
			<App
				onResetConnectionClick={onResetConnectionClick}
				connectionInput={connectionInput}
				onConnectionInputChange={onConnectionInputChange}
				onAddConnectionClick={onAddConnectionClick}
				onDeleteConnectionClick={onDeleteConnectionClick}
				onDeleteElementClick={onDeleteElementClick}
			/>
			<AnotherContainer />
		</>
	);
};

export default AppContainer;
