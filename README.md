# React Transition

## What is it about ?

React Transition is a wrapper for your components whose purpose is to apply animations on mount/exit. I did got inspired by React Transition Group, a pretty cool library whose purpose is similar. Though I couldn't make it work properly - as some other people - so I decided to make my own lib.

## Getting started

You need to be using typescript for your project.

Let's first install the library.

```
yarn add @jsee_dev/react-transition
```

or

```
npm install @jsee_dev/react-transition
```

Usage is quite simple. First import the component named Transition, and wrap whatever you need to be transitioned. Like so :

```tsx
import Transition from "@jsee_dev/react-transition";

const MyApp: React.FC = () => {
  const [open, setOpen] = useState(false);
  const text = useRef<HTMLParagraphElement>(null);

  return (
    <div>
      <button onClick={() => setOpen(!open)}>Click me !</button>
      <Transition trigger={open} classPrefix={"super-example"} timeout={250} elementRef={text}>
        <p ref={text}>Hello World ! I am visible !</p>
      </Transition>
    </div>
  );
};
```

Here's the logic :

- when the trigger prop is set on true :
  - a timer starts
  - the component is mounted with a class starting with the prefix you've chosen, and ending with "--mounting"
  - once the timeout has passed, this class is replaced with another ending with "--active"
- now when the trigger prop is set back to false :
  - the class gets replaced again by a last one ending with "--unmounting"
  - a new timer starts
  - once the timeout has passed, the component is simply unmounted

### First use case

As the exemple above, the Transition component wraps a pure JSX element. We have to get a reference of that element in the DOM, hence the useRef hook. Then pass this reference to the component through the elementRef prop.

### Second use case

If you're wrapping a custom component, just set it a prop named "nodeRef" that will take the useRef variable. Inside your component, this prop will have to point to the ref prop of your root JSX element. That's all, no need to set any elementRef prop on the Transition component.

See :

```tsx
import Transition from "@jsee_dev/react-transition";

const MyComponent: React.FC<{ nodeRef: RefObject<HTMLParagraphElement> }> = ({ nodeRef }) => {
  return <p ref={nodeRef}>Hello World ! I am visible !</p>;
};

const MyApp: React.FC = () => {
  const [open, setOpen] = useState(false);
  const text = useRef<HTMLParagraphElement>(null);

  return (
    <div>
      <button onClick={() => setOpen(!open)}>Click me !</button>
      <Transition trigger={open} classPrefix={"super-example"} timeout={250}>
        <MyComponent nodeRef={text} />
      </Transition>
    </div>
  );
};
```

There you go ! Have fun and feel free to bring any improvements as you like.

## Reference API

### The Transition component props

- **trigger** : the value that will indicate whether the component should me mounted or not.
  - type : _boolean_
- **bypass** : bypasses all the animations. Simply mounts and unmounts the component according the value of trigger, keeping the onMount and onUnmount methods effective.
  - type : _boolean_
- **classPrefix** : (optional) the name your animation classes will be starting with. If not defined, "component" will be used.
  - type : _string_
- **timeout** : (optional) the duration of the animations in ms. An array of two values can be set in order to specify different timeouts for the mounting/unmounting animations. If not defined, it will be set to 250.
  - type : _number_ or _[number, number]_
- **elementRef** : (optional) the reference of whatever you have set as children if it is pure JSX.
  - type : _RefObject\<type of the element\>_
- **onMount** : (optional) a callback function to be triggered immediately after the children has been mounted.
  - type : _() => void_
- **onMounted** : (optional) a callback function to be triggered once the first timeout has passed.
  - type : _() => void_
- **onUnmount** : (optional) a callback function to be triggered when the second timer has started.
  - type : _() => void_
- **onUnmounted** : (optional) a callback function to be triggered after the children has been unmounted.
  - type : _() => void_
