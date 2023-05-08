import { BsStar, BsStarFill } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function StarRating(props) {
  const rating = props.rating;
  const stars = [0, 1, 2, 3, 4].map(i => (i < rating) ? <BsStarFill key={"star-" + i} /> : <BsStar key={"star-" + i} />);
  return (
    <div id="five-star-rating">
      {stars}
    </div>
  );
}

export default StarRating;