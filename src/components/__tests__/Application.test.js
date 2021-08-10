import React from 'react';
import axios from '__mocks__/axios';

import { render, cleanup, waitForElement, fireEvent, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from '@testing-library/react';

import Application from 'components/Application';

afterEach(cleanup);

describe('Application', () => {
  it('changes the schedule when a new day is selected', async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText('Monday'));

    fireEvent.click(getByText('Tuesday'));

    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });

  it('loads data, books an interview and reduces the spots remaining for Monday by 1', async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, 'appointment')[0];

    // 3. Click the "Add" button on the first empty appointment.
    fireEvent.click(getByAltText(appointment, 'Add'));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, 'Enter Student Name'), {
      target: { value: 'Lydia Miller-Jones' }
    });

    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, 'Save'));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => queryByText(appointment, 'Lydia Miller-Jones'));

    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const day = getAllByTestId(container, 'day').find((day) => queryByText(day, 'Monday'));
    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
  });

  it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, 'appointment').find((appointment) => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, 'Are you sure you would like to delete?')).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, 'Add'));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, 'day').find((day) => queryByText(day, 'Monday'));
    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();
  });

  it('loads data, edits an interview and keeps the spots remaining for Monday the same', async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, 'appointment').find((appointment) => queryByText(appointment, 'Archie Cohen'));

    // 3. Click the "Edit" button on the booked appointment.
    fireEvent.click(getByAltText(appointment, 'Edit'));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, 'Enter Student Name'), {
      target: { value: 'Lydia Miller-Jones' }
    });

    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, 'Save'));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => queryByText(appointment, 'Lydia Miller-Jones'));

    // 9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, 'day').find((day) => queryByText(day, 'Monday'));
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });

  it('shows the save error when failing to save an appointment', async () => {
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, 'appointment')[0];

    // 3. Click the "Add" button on the first empty appointment.
    fireEvent.click(getByAltText(appointment, 'Add'));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, 'Enter Student Name'), {
      target: { value: 'Lydia Miller-Jones' }
    });

    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, 'Save'));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    // 8. Check that the error element with the text "Could not save appointment" is displayed
    await waitForElement(() => getByText(appointment, 'Could not save appointment'));

    // 9. Wait until the element with the "Close" button is displayed.
    expect(getByAltText(appointment, 'Close')).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, 'Close'));

    // 10. Check that the form element is displayed.
    expect(getByPlaceholderText(appointment, 'Enter Student Name')).toBeInTheDocument();
  });

  it('shows the delete error when failing to delete an existing appointment', async () => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, 'appointment').find((appointment) => queryByText(appointment, 'Archie Cohen'));

    // 3. Click the "Delete" button on the booked appointment.
    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, 'Are you sure you would like to delete?')).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    // 7. Check that the error element with the text "Could not cancel appointment" is displayed
    await waitForElement(() => getByText(appointment, 'Could not cancel appointment'));

    // 8. Wait until the element with the "Close" button is displayed.
    expect(getByAltText(appointment, 'Close')).toBeInTheDocument();

    // 9. Click the "Close" button
    fireEvent.click(getByAltText(appointment, 'Close'));

    // 10. Check that the appointment is displayed again
    expect(getByText(appointment, 'Archie Cohen')).toBeInTheDocument();
  });
});
