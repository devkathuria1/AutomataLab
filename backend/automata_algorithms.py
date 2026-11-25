"""
Python implementation of AutomataLab's core ε-NFA -> DFA algorithms.

Converted from `src/algorithms/`:
  - epsilonClosure.js          -> epsilon_closure()
  - calculateAllClosures.js    -> calculate_all_closures()
  - subsetConstruction.js      -> subset_construction()
  - subsetConstructionSteps.js -> subset_construction_steps()
  - simulateDFA.js             -> simulate_dfa()

An epsilon transition is represented by `symbol=None`.
"""

from collections import deque
from dataclasses import dataclass


@dataclass(frozen=True)
class Transition:
    from_state: str
    symbol: str | None  # None represents ε (epsilon)
    to_state: str


@dataclass
class Automaton:
    states: list[str]
    alphabet: list[str]
    start_state: str
    accept_states: list[str]
    transitions: list[Transition]


def automaton_from_dict(data: dict) -> Automaton:
    """Convert a JSON dictionary from the React frontend into an Automaton."""
    return Automaton(
        states=list(data.get("states", [])),
        alphabet=list(data.get("alphabet", [])),
        start_state=data["startState"],
        accept_states=list(data.get("acceptStates", [])),
        transitions=[
            Transition(
                from_state=t["from"],
                symbol=t.get("symbol"),
                to_state=t["to"],
            )
            for t in data.get("transitions", [])
        ],
    )


def automaton_to_dict(automaton: Automaton) -> dict:
    """Convert an Automaton back into the camelCase JSON shape expected by React."""
    return {
        "states": automaton.states,
        "alphabet": automaton.alphabet,
        "startState": automaton.start_state,
        "acceptStates": automaton.accept_states,
        "transitions": [
            {
                "from": t.from_state,
                "symbol": t.symbol,
                "to": t.to_state,
            }
            for t in automaton.transitions
        ],
    }


def format_dfa_state(states: frozenset[str], state_order: list[str]) -> str:
    """Format a subset of NFA states as '{q0, q1}', or '∅' if empty."""
    ordered = [s for s in state_order if s in states]
    return "∅" if not ordered else "{" + ", ".join(ordered) + "}"


def epsilon_closure(
    automaton: Automaton, input_states: str | set[str] | frozenset[str] | list[str]
) -> frozenset[str]:
    """
    Return all states reachable from `input_states` using zero or more ε-transitions.
    """
    stack = [input_states] if isinstance(input_states, str) else list(input_states)
    closure = set(stack)

    while stack:
        current = stack.pop()
        for t in automaton.transitions:
            if t.from_state == current and t.symbol is None and t.to_state not in closure:
                closure.add(t.to_state)
                stack.append(t.to_state)

    return frozenset(closure)


def calculate_all_closures(automaton: Automaton) -> list[dict]:
    """Compute the ε-closure for every state in the automaton."""
    return [
        {
            "state": state,
            "closure": [s for s in automaton.states if s in epsilon_closure(automaton, state)],
        }
        for state in automaton.states
    ]


def move(automaton: Automaton, states: frozenset[str], symbol: str) -> frozenset[str]:
    """Return all states reachable from `states` on a single `symbol` transition."""
    return frozenset(
        t.to_state
        for t in automaton.transitions
        if t.from_state in states and t.symbol == symbol
    )


def subset_construction(automaton: Automaton) -> Automaton:
    """
    Convert an ε-NFA into an equivalent DFA using BFS subset construction.
    """
    start_subset = epsilon_closure(automaton, automaton.start_state)

    visited: dict[frozenset[str], str] = {
        start_subset: format_dfa_state(start_subset, automaton.states)
    }
    queue = deque([start_subset])
    dfa_transitions: list[Transition] = []

    while queue:
        current_subset = queue.popleft()
        current_name = visited[current_subset]

        for symbol in automaton.alphabet:
            moved = move(automaton, current_subset, symbol)
            next_subset = epsilon_closure(automaton, moved)

            if next_subset not in visited:
                visited[next_subset] = format_dfa_state(next_subset, automaton.states)
                queue.append(next_subset)

            dfa_transitions.append(
                Transition(from_state=current_name, symbol=symbol, to_state=visited[next_subset])
            )

    accept_set = set(automaton.accept_states)
    dfa_accept_states = [
        name for subset, name in visited.items() if subset & accept_set
    ]

    return Automaton(
        states=list(visited.values()),
        alphabet=list(automaton.alphabet),
        start_state=visited[start_subset],
        accept_states=dfa_accept_states,
        transitions=dfa_transitions,
    )


def subset_construction_steps(automaton: Automaton) -> tuple[Automaton, list[dict]]:
    """
    Same as `subset_construction`, but also returns a step-by-step trace
    explaining how each DFA state and transition is discovered.
    """
    steps: list[dict] = []
    start_subset = epsilon_closure(automaton, automaton.start_state)
    start_name = format_dfa_state(start_subset, automaton.states)

    visited: dict[frozenset[str], str] = {start_subset: start_name}
    queue = deque([start_subset])

    steps.append(
        {
            "type": "start",
            "state": start_name,
            "message": (
                f"Calculate the ε-closure of the start state "
                f"{automaton.start_state}: {start_name}. This is the DFA start state."
            ),
        }
    )

    dfa_transitions: list[Transition] = []
    accepting_states: list[str] = []
    accept_set = set(automaton.accept_states)

    while queue:
        current_subset = queue.popleft()
        current_name = visited[current_subset]

        if current_subset & accept_set:
            if current_name not in accepting_states:
                accepting_states.append(current_name)
            steps.append(
                {
                    "type": "accepting",
                    "state": current_name,
                    "message": (
                        f"{current_name} is accepting because it contains "
                        f"an accepting ε-NFA state."
                    ),
                }
            )

        for symbol in automaton.alphabet:
            moved = move(automaton, current_subset, symbol)
            next_subset = epsilon_closure(automaton, moved)

            if next_subset not in visited:
                next_name = format_dfa_state(next_subset, automaton.states)
                visited[next_subset] = next_name
                queue.append(next_subset)
                steps.append(
                    {
                        "type": "new-state",
                        "state": next_name,
                        "message": f"Discovered DFA state {next_name}.",
                    }
                )
            else:
                next_name = visited[next_subset]

            dfa_transitions.append(
                Transition(from_state=current_name, symbol=symbol, to_state=next_name)
            )

            moved_str = format_dfa_state(moved, automaton.states)
            steps.append(
                {
                    "type": "transition",
                    "from": current_name,
                    "symbol": symbol,
                    "move": [s for s in automaton.states if s in moved],
                    "closure": [s for s in automaton.states if s in next_subset],
                    "to": next_name,
                    "message": (
                        f'From {current_name}, read "{symbol}". '
                        f"Move gives {moved_str}; its ε-closure is {next_name}."
                    ),
                }
            )

    dfa = Automaton(
        states=list(visited.values()),
        alphabet=list(automaton.alphabet),
        start_state=start_name,
        accept_states=accepting_states,
        transitions=dfa_transitions,
    )
    return dfa, steps


def simulate_dfa(automaton: Automaton, input_string: str) -> dict:
    """
    Convert `automaton` to a DFA and simulate `input_string` symbol by symbol.
    """
    dfa = subset_construction(automaton)

    transition_table = {
        (t.from_state, t.symbol): t.to_state for t in dfa.transitions
    }

    current_state = dfa.start_state
    steps = [{"position": 0, "symbol": None, "state": current_state}]

    for index, symbol in enumerate(input_string, start=1):
        if symbol not in dfa.alphabet:
            return {
                "accepted": False,
                "validInput": False,
                "reason": f"Unknown input symbol: {symbol}",
                "steps": steps,
                "finalState": current_state,
            }

        next_state = transition_table.get((current_state, symbol))
        if next_state is None:
            return {
                "accepted": False,
                "validInput": True,
                "reason": f'No transition for symbol "{symbol}"',
                "steps": steps,
                "finalState": current_state,
            }

        current_state = next_state
        steps.append({"position": index, "symbol": symbol, "state": current_state})

    accepted = current_state in dfa.accept_states
    return {
        "accepted": accepted,
        "validInput": True,
        "reason": "The DFA accepts this string." if accepted else "The DFA rejects this string.",
        "steps": steps,
        "finalState": current_state,
    }
