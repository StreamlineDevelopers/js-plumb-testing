import React, { useCallback, useEffect, useState } from 'react';
import { jsPlumb } from 'jsplumb';

// ui
import App from './App.js';

// sample data
import SampleData from './sampleData.json';

const AppContainer = () => {
	const [jsPlumbInst, setjsPlumbInst] = useState(null);

	//#region //* JS PLUMB FUNCTIONS
	const initializeJsPlumb = useCallback(() => {
		const jsPlumbDefaultOptions = {
			Endpoints: [['Dot', { radius: 13 }]],
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

		setjsPlumbInst(jsPlumbInstance);

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
			onMaxConnections: (params, originalEvent) => {
				console.log('element is ', params.endpoint.start(), 'maxConnections is', params.maxConnections);
				console.log('params', params);
				console.log('event', originalEvent);
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

			connection.getOverlay('label').setLabel(sourceId);
		});

		jsPlumbInstance.bind('dblclick', (data, e) => {
			const { sourceId } = data;
			jsPlumbInstance.deleteConnectionsForElement(sourceId);
		});

		jsPlumbInstance.bind('contextmenu', function (data, e) {
			//Connect the mouse to the right click event
		});
	};

	const onResetConnectionClick = () => {
		jsPlumbInst.deleteEveryConnection();
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

	return <App onResetConnectionClick={onResetConnectionClick} />;
};

export default AppContainer;
