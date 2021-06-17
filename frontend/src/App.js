import React from 'react';

// antd
import { Button } from 'antd';

const App = ({ onResetConnectionClick }) => {
	return (
		<div className='app'>
			<div className='app__body'>
				<header className='app__header'>
					<h1>JSPlumb Testing</h1>

					<div className='app__header-buttons'>
						<Button type='primary'>Add Connections</Button>
						<Button type='default' onClick={onResetConnectionClick}>
							Reset Connections
						</Button>
					</div>
				</header>

				<div className='app__contents' id='app-container'>
					<div className='app__left' id='app__left-container'>
						<section id='app__left-one'>
							<h1 className='app__left-one__label'>left one</h1>
						</section>
						<section id='app__left-two'>
							<h1 className='app__left-two__label'>left two</h1>
						</section>
						<section id='app__left-three'>
							<h1 className='app__left-three__label'>left three</h1>
						</section>
					</div>

					<div className='app__right' id='app__right-container'>
						<section id='app__right-one'>
							<h1 className='app__right-one__label'>right one</h1>
						</section>
						<section id='app__right-two'>
							<h1 className='app__right-two__label'>right two</h1>
						</section>
						<section id='app__right-three'>
							<h1 className='app__right-three__label'>right three</h1>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
