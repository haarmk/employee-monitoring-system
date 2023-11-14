import { ErrorBoundary } from "react-error-boundary";
import { useErrorBoundary } from "react-error-boundary";

export default function ReactErrorBoundary(props) {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorPage}
            onError={(error, errorInfo) => {
                // log the error
				
            }}
            onReset={() => {
                // reloading the page to restore the initial state
                // of the current page
                
                window.location.reload();

                // other reset logic...
            }}
        >
            {props.children}
        </ErrorBoundary>
    );
}


function ErrorPage(props) {
    const { resetBoundary } = useErrorBoundary();
    return (
        <div className={"error-page"}>
            <div className={"oops"}>Oops!</div>
            <div className={"message"}>Something went wrong...</div>
            {props.resetErrorBoundary && (
                <div>
                    <button onClick={resetBoundary}>🔄 Try Again!</button>
                   
                </div>
            )}
        </div>
    );
}
