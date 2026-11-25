import { Check, Flame, RotateCcw, ArrowDownRight } from 'lucide-react';
import { TOPPINGS, TOPPING_COORDINATES } from '../data/pizzaData';
import rawPizza from '../assets/images/pizza-cheese-raw.webp';
import cookedPizza from '../assets/images/pizza-cheese-baked.webp';

export function PizzaDisc({ selectedToppings = {}, baked = false, className = '' }) {
  return (
    <div className={`pizza-disc ${baked ? 'is-baked' : ''} ${className}`}>
      <img className="pizza-base" src={rawPizza} alt={baked ? 'Your freshly baked pizza' : 'Hand-stretched cheese pizza'} draggable="false" />
      <img className="pizza-cooked" src={cookedPizza} alt="" aria-hidden="true" draggable="false" />
      <div className="crust-char" />
      {TOPPINGS.map(item => selectedToppings[item.id] && (
        <div className="topping-layer" key={item.id}>
          {TOPPING_COORDINATES[item.id].map((point, i) => (
            <span key={i} className={`pizza-topping topping-${item.id}`} style={{ left: `${point.x}%`, top: `${point.y}%`, '--turn': `${point.r}deg`, '--delay': `${i * 45}ms` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function getFootnote(selectedToppings) {
  const count = TOPPINGS.filter(t => selectedToppings[t.id]).length;
  if (count === 0) return 'Plain cheese is a classic. Nobody\'s judging.';
  if (count === TOPPINGS.length) return 'Everything? Respect.';
  return 'Now we\'re talking.';
}

export function CustomizerCard({ selectedToppings, onToggleTopping, totalPrice, onFireIt, status, onReset }) {
  const busy = status === 'baking';
  return (
    <div className="builder-card">
      <div className="builder-eyebrow"><span className="live-dot" /> STEP IN · 18" PIE</div>
      <h2>{status === 'baked' ? <>THAT'S <em>YOUR PIE.</em></> : <>NOW IT'S <em>YOURS.</em></>}</h2>
      <p className="builder-description">{status === 'baked' ? 'Blistered crust. Melted mozz. Made your way.' : 'Pick what flies onto it. Tap again to take it off.'}</p>
      <div className="topping-options">
        {TOPPINGS.map(item => (
          <button type="button" key={item.id} aria-pressed={Boolean(selectedToppings[item.id])} disabled={status !== 'idle'} onClick={() => onToggleTopping(item.id)} className={`topping-option ${selectedToppings[item.id] ? 'selected' : ''}`}>
            <span className={`ingredient-icon topping-${item.id}`} />
            <span className="topping-name">{item.name}<small>+${item.price.toFixed(2)}</small></span>
            <span className="topping-check">{selectedToppings[item.id] && <Check size={12} />}</span>
          </button>
        ))}
      </div>
      {status === 'baked' ? (
        <div className="builder-result">
          <button
            type="button"
            className="fire-button"
            onClick={() => {
              if (window.__lenis) {
                window.__lenis.scrollTo('#receipt', { duration: 1.4 });
              } else {
                document.getElementById('receipt')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <span>ORDER UP <ArrowDownRight size={18} /></span>
            <span>${totalPrice}</span>
          </button>
          <button type="button" className="reset-pie" onClick={onReset}><RotateCcw size={12} /> Make another pie</button>
        </div>
      ) : (
        <><button type="button" className="fire-button" disabled={busy} onClick={onFireIt}><span><Flame size={18} />{busy ? 'IN THE FIRE…' : 'FIRE IT'}</span><span>${totalPrice}</span></button><p className="builder-footnote">{busy ? 'A little heat. A lot of magic.' : getFootnote(selectedToppings)}</p></>
      )}
    </div>
  );
}
