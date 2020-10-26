/*
 * Copyright (c) 2017-present, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	TouchableHighlight,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { oauth, net } from 'react-native-force';
import AudioRecord from 'react-native-audio-record';

AudioRecord.on('data', (data) => {
	// base64-encoded audio data chunks
	console.log('dataListener: recording is in progress');
});

class ContactListScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = { data: [] };
	}

	onStartRecord = async () => {
		console.log('onStartRecord: ');
		const options = {
			sampleRate: 16000, // default 44100
			channels: 1, // 1 or 2, default 1
			bitsPerSample: 16, // 8 or 16, default 16
			audioSource: 6, // android only
			wavFile: 'test.wav', // default 'audio.wav'
		};

		// init and start recording
		AudioRecord.init(options);
		AudioRecord.start();
	};

	onStopRecord = async () => {
		// AudioRecord.init(options);
		AudioRecord.stop();
		audioFile = await AudioRecord.stop();

		// audio file is saved and a path is returned
		console.log('audioFile: ' + audioFile);

		// prepare a file for upload
		const file = {
			uri: audioFile, // e.g. 'file:///path/to/file/image123.jpg'
			name: 'test.wav', // e.g. 'image123.jpg',
			type: 'audio/wav', // e.g. 'image/jpg'
		};

		// upload a file to Wit.ai and process response
		try {
			const witAccessToken = '';
			let response = await fetch('https://api.wit.ai/speech?v=20201025', {
				method: 'POST',
				headers: {
					'Content-Type': 'audio/wav',
					Authorization: 'Bearer ' + witAccessToken,
				},
				body: file,
			});
			let jsonResp = await response.json();
			console.log('audoResp: ' + JSON.stringify(jsonResp));

			// 'text' attribute indicates about successfull processing by wit.ai
			if (jsonResp.text) {
				this.setState({ recognizedText: jsonResp.text });

				let limits = jsonResp.entities['wit$number:number'];
				console.log('limits: ' + JSON.stringify(limits));
				let queryLimit;
				let sfLimit;
				if (Array.isArray(limits)) {
					queryLimit = limits[0].value;
					if (Number.isInteger(queryLimit)) {
						sfLimit = queryLimit;
					}
				}

				let jsonEntities = JSON.stringify(jsonResp.entities);
				console.log('jsonEntities: ' + jsonEntities);
				let sobjects = jsonResp.entities['contacts:contacts'];
				console.log('sobjects: ' + JSON.stringify(sobjects));
				let sobject;
				let sfObject;
				if (Array.isArray(sobjects)) {
					sobject = sobjects[0].value;
					console.log('@@sobject: ' + sobject);
					if (sobject === 'contact') sfObject = 'CONTACT';
				}

				let actions = jsonResp.entities['show:show'];
				console.log('actions: ' + JSON.stringify(actions));
				let action;
				let sfAction;
				if (Array.isArray(actions)) {
					action = actions[0].value;
					if (action === 'show') sfAction = 'SELECT';
				}

				console.log('queryLimit: ' + sfLimit);
				console.log('sobject: ' + sfObject);
				console.log('action: ' + sfAction);

				let sfQueryString =
					sfAction + ' Id, Name  FROM ' + sfObject + ' LIMIT ' + queryLimit;
				this.setState({ sfQueryString: sfQueryString });

				// if Salesforce params were recognized correctly, run a query to Salesforce:
				if (sfObject && queryLimit) {
					console.log('fetchingByNewQuery');
					this.fetchDataWithParams(sfObject, sfLimit);
				}
			} else {
				this.setState({
					recognizedText: 'Speech was not recognized. Please try again',
				});
			}

			// return json;
		} catch (error) {
			console.error(error);
		}
	};

	componentDidMount() {
		var that = this;
		oauth.getAuthCredentials(
			() => that.fetchData(), // already logged in
			() => {
				oauth.authenticate(
					() => that.fetchData(),
					(error) => console.log('Failed to authenticate:' + error)
				);
			}
		);
	}

	fetchData() {
		var that = this;
		net.query(
			'SELECT Id, Name FROM Contact ORDER BY NAME ASC LIMIT 1',
			(response) => that.setState({ data: response.records })
		);
	}

	fetchDataWithParams(sObjectName, numOfRecords) {
		var that = this;
		net.query(
			'SELECT Id, Name FROM ' + sObjectName + ' LIMIT ' + numOfRecords,
			(response) => that.setState({ data: response.records })
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableHighlight
					style={{ ...styles.actionButton, backgroundColor: '#2196F3' }}
					onPress={() => {
						this.onStartRecord();
					}}
				>
					<Text style={styles.textStyle}>Start Recording</Text>
				</TouchableHighlight>
				<TouchableHighlight
					style={{ ...styles.actionButton, backgroundColor: '#2196F3' }}
					onPress={() => {
						this.onStopRecord();
					}}
				>
					<Text style={styles.textStyle}>Stop Recording</Text>
				</TouchableHighlight>

				<Text style={styles.sectionHeader}>Recorded Text:</Text>
				<Text style={styles.item}>{this.state.recognizedText}</Text>

				<Text style={styles.sectionHeader}>Salesforce Query:</Text>
				<Text style={styles.item}>{this.state.sfQueryString}</Text>

				<Text style={styles.sectionHeader}>Output:</Text>
				<FlatList
					data={this.state.data}
					renderItem={({ item }) => (
						<Text style={styles.item}>{item.Name}</Text>
					)}
					keyExtractor={(item, index) => 'key_' + index}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 22,
		backgroundColor: 'white',
	},
	item: {
		padding: 10,
		fontSize: 18,
		height: 44,
	},
	sectionHeader: {
		padding: 10,
		fontSize: 18,
		height: 44,
		fontWeight: 'bold',
	},
	actionButton: {
		backgroundColor: '#F194FF',
		borderRadius: 20,
		marginLeft: 40,
		marginRight: 40,
		marginBottom: 20,
		padding: 10,
		elevation: 2,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
});

const Stack = createStackNavigator();

export const App = function () {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="Mobile SDK Sample App"
					component={ContactListScreen}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};
