import React, { Fragment } from 'react';
import CsrfToken from '../csrf-token/input';
export default function PinButton ({ showPrioritiseButton, id, name, directType, prioritised }) {

	const getAction = () => `/__myft/api/core/prioritised/concept/${id}?method=${prioritised ? 'delete' : 'put'}`;

	if (!showPrioritiseButton) {
		return null;
	}

	return (
		<Fragment>
			{showPrioritiseButton &&
				<Fragment>
					<span className="myft-pin-divider"></span>
					<div className="myft-pin-button-wrapper">
						<form method="post" action={getAction()} data-myft-prioritise>
							<CsrfToken />
							<input type="hidden" value={name} name="name" />
							<input type="hidden" value={directType || 'http://www.ft.com/ontology/concept/Concept'} name="directType" />
							<div
								className="n-myft-ui__announcement o-normalise-visually-hidden"
								aria-live="assertive"
								data-pressed-text={`${name} pinned in myFT.`}
								data-unpressed-text={`Unpinned ${name} from myFT.`}
							></div>
							<button id={`myft-pin-button__${id}`}
								className="myft-pin-button"
								data-prioritise-button
								data-trackable="prioritised"
								data-concept-id={id}
								data-prioritised={prioritised ? true : false}
								aria-label={`${prioritised ? 'Unpin' : 'Pin'} ${name} ${prioritised ? 'from' : 'in'} myFT`}
								aria-pressed={prioritised ? true : false}
								title={`${prioritised ? 'Unpin' : 'Pin'} ${name}`}>
							</button>
						</form>
					</div>
				</Fragment>
			}
		</Fragment>
	)

}
