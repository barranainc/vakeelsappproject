import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../../Screens/SplashScreen/Splash';
import Onboarding from '../../Screens/OnBoarding/Onboarding';
import ContinueAs from '../../Screens/LoginScreens/ContinueAs';
import Register from '../../Screens/Register/Register';
import Login from '../../Screens/LoginScreens/Login';
import Home from '../../Screens/HomeScreens/Home';
import Profile from '../../Screens/ProfileScreens/Profile';
import ClientRegister from '../../Screens/ClientScreens/ClientRegister';
import ClientOTP from '../../Screens/ClientScreens/ClientOTP';
import LawyerRegister from '../../Screens/LawyerScreens/LawyerRegister';
import ClientHome from '../../Screens/ClientScreens/ClientHome';
import CreateMatter1 from '../../Screens/ClientScreens/CreateMatter1';
import CreateMatter2 from '../../Screens/ClientScreens/CreateMatter2';
import CreateMatter3 from '../../Screens/ClientScreens/CreateMatter3';
import SuccessScreen from '../../Screens/ClientScreens/SuccessScreen';
import AddRequest1 from '../../Screens/ClientScreens/AddRequest1';
import AddRequest2 from '../../Screens/ClientScreens/AddRequest2';
import AddRequest3 from '../../Screens/ClientScreens/AddRequest3';
import MyMatters1 from '../../Screens/ClientScreens/MyMatters1';
import LawyerOTP from '../../Screens/LawyerScreens/LawyerOTP';
import MyMatters2 from '../../Screens/ClientScreens/MyMatters2';
import MyRequest1 from '../../Screens/ClientScreens/MyRequest1';
import MyRequest2 from '../../Screens/ClientScreens/MyRequest2';
import ProfileDetails from '../../Screens/ClientScreens/ProfileDetails';
import ChangePassword from '../../Screens/ClientScreens/ChangePassword';
import LawyerPostedMatter from '../../Screens/LawyerScreens/LawyerPostedMatter';
import ClientRegistration from '../../Screens/ClientScreens/ClientRegistration';
import GetCases from '../../Screens/LawyerScreens/caseManagement/GetCases';
import PostCase1 from '../../Screens/LawyerScreens/caseManagement/PostCase1';
import PostCase3 from '../../Screens/LawyerScreens/caseManagement/PostCase3';
import CaseDetails from '../../Screens/LawyerScreens/caseManagement/CaseDetails';
import CaseProceeding from '../../Screens/LawyerScreens/caseManagement/CaseProceeding';
import DairyManagement from '../../Screens/dairyManagement/DairyManagement';
import Teams from '../../Screens/LawyerScreens/teamManagement/Teams';
import AddTeam1 from '../../Screens/LawyerScreens/teamManagement/AddTeam1';
import AddTeam2 from '../../Screens/LawyerScreens/teamManagement/AddTeam2';
import LawyerProfile from '../../Screens/LawyerScreens/LawyerProfile';
import TeamMemberDetails from '../../Screens/LawyerScreens/teamManagement/TeamMemberDetails';
import Chat from '../../Screens/chat/Index';
import IndividualChat from '../../Screens/chat/IndividualChat';
import Notifications from '../../Screens/notifications/Index';
import PostCase2 from '../../Screens/LawyerScreens/caseManagement/PostCases2';
import EditLawyerProfile from '../../Screens/LawyerScreens/EditProfile';
import ForgetPassword from '../../Screens/forgetPassword/Index';
import EditTeam1 from '../../Screens/LawyerScreens/teamManagement/EditTeam1';
import EditTeam2 from '../../Screens/LawyerScreens/teamManagement/EditTeam2';
import LawyerDetails from '../../Screens/ClientScreens/LawyerDetails';

const Stack = createNativeStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        cardStyleInterpolator: ({current, layouts}) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        }),
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 2000, // Slow down the opening animation
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 500, // Default duration for closing
            },
          },
        },
      }}>
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false, animation: 'fade'}}
      />
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{headerShown: false, animation: 'fade'}}
      />
      <Stack.Screen
        name="ContinueAs"
        component={ContinueAs}
        options={{headerShown: false, animation: 'fade'}}
      />
      <Stack.Screen
        name="ClientRegister"
        component={ClientRegister}
        options={{headerShown: false, animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="ClientRegistration"
        component={ClientRegistration}
        options={{headerShown: false, animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="LawyerRegister"
        component={LawyerRegister}
        options={{headerShown: false, animation: 'fade'}}
      />
      <Stack.Screen
        name="ClientOTP"
        component={ClientOTP}
        options={{headerShown: false, animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false, animation: 'fade'}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="ClientHome"
        component={ClientHome}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="CreateMatter1"
        component={CreateMatter1}
        options={{headerShown: false, animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="CreateMatter2"
        component={CreateMatter2}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="CreateMatter3"
        component={CreateMatter3}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="SuccessScreen"
        component={SuccessScreen}
        options={{headerShown: false, animation: 'flip'}}
      />
      <Stack.Screen
        name="AddRequest1"
        component={AddRequest1}
        options={{headerShown: false, animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="AddRequest2"
        component={AddRequest2}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="AddRequest3"
        component={AddRequest3}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="MyMatters1"
        component={MyMatters1}
        options={{headerShown: false, animation: 'slide_from_left'}}
      />
      <Stack.Screen
        name="MyMatters2"
        component={MyMatters2}
        options={{headerShown: false, animation: 'flip'}}
      />
      <Stack.Screen
        name="MyRequest1"
        component={MyRequest1}
        options={{headerShown: false, animation: 'slide_from_left'}}
      />
      <Stack.Screen
        name="MyRequest2"
        component={MyRequest2}
        options={{headerShown: false, animation: 'flip'}}
      />
      <Stack.Screen
        name="ProfileDetails"
        component={ProfileDetails}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />
      <Stack.Screen
        name="LawyerPostedMatter"
        component={LawyerPostedMatter}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false, animation: 'flip'}}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: true, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="LawyerOtp"
        component={LawyerOTP}
        options={{headerShown: true, animation: 'slide_from_bottom'}}
      />
       <Stack.Screen
        name="Forgot Password"
        component={ForgetPassword}
        options={{headerShown: true, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="GetAllCases"
        component={GetCases}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="PostCase1"
        component={PostCase1}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PostCase3"
        component={PostCase3}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CaseDetails"
        component={CaseDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CaseProceeding"
        component={CaseProceeding}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="DairyManagement"
        component={DairyManagement}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="Teams"
        component={Teams}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="AddTeam1"
        component={AddTeam1}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="AddTeam2"
        component={AddTeam2}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
       <Stack.Screen
        name="EditTeam1"
        component={EditTeam1}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="EditTeam2"
        component={EditTeam2}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="LawyerProfile"
        component={LawyerProfile}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
       <Stack.Screen
        name="LawyerDetails"
        component={LawyerDetails}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="TeamMemberDetails"
        component={TeamMemberDetails}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="IndividualChat"
        component={IndividualChat}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
        <Stack.Screen
        name="PostCases2"
        component={PostCase2}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
        <Stack.Screen
        name="EditLawyerProfile"
        component={EditLawyerProfile}
        options={{headerShown: false, animation: 'slide_from_bottom'}}
      />
    </Stack.Navigator>
  );
}
