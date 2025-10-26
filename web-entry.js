import { AppRegistry } from 'react-native';
import App from './App';

// Register the main component
AppRegistry.registerComponent('main', () => App);

// For web: Run the application when DOM is ready
if (typeof document !== 'undefined') {
  const rootTag = document.getElementById('root');
  if (rootTag) {
    AppRegistry.runApplication('main', {
      initialProps: {},
      rootTag: rootTag,
    });
  }
}