package com.ensaj.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ensaj.IntegrationTest;
import com.ensaj.domain.Dermatologue;
import com.ensaj.repository.DermatologueRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link DermatologueResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DermatologueResourceIT {

    private static final String DEFAULT_CODE_EMP = "AAAAAAAAAA";
    private static final String UPDATED_CODE_EMP = "BBBBBBBBBB";

    private static final String DEFAULT_GENRE = "AAAAAAAAAA";
    private static final String UPDATED_GENRE = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/dermatologues";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private DermatologueRepository dermatologueRepository;

    @Autowired
    private MockMvc restDermatologueMockMvc;

    private Dermatologue dermatologue;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Dermatologue createEntity() {
        Dermatologue dermatologue = new Dermatologue().codeEmp(DEFAULT_CODE_EMP).genre(DEFAULT_GENRE).telephone(DEFAULT_TELEPHONE);
        return dermatologue;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Dermatologue createUpdatedEntity() {
        Dermatologue dermatologue = new Dermatologue().codeEmp(UPDATED_CODE_EMP).genre(UPDATED_GENRE).telephone(UPDATED_TELEPHONE);
        return dermatologue;
    }

    @BeforeEach
    public void initTest() {
        dermatologueRepository.deleteAll();
        dermatologue = createEntity();
    }

    @Test
    void createDermatologue() throws Exception {
        int databaseSizeBeforeCreate = dermatologueRepository.findAll().size();
        // Create the Dermatologue
        restDermatologueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dermatologue)))
            .andExpect(status().isCreated());

        // Validate the Dermatologue in the database
        List<Dermatologue> dermatologueList = dermatologueRepository.findAll();
        assertThat(dermatologueList).hasSize(databaseSizeBeforeCreate + 1);
        Dermatologue testDermatologue = dermatologueList.get(dermatologueList.size() - 1);
        assertThat(testDermatologue.getCodeEmp()).isEqualTo(DEFAULT_CODE_EMP);
        assertThat(testDermatologue.getGenre()).isEqualTo(DEFAULT_GENRE);
        assertThat(testDermatologue.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
    }

    @Test
    void createDermatologueWithExistingId() throws Exception {
        // Create the Dermatologue with an existing ID
        dermatologue.setId("existing_id");

        int databaseSizeBeforeCreate = dermatologueRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDermatologueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dermatologue)))
            .andExpect(status().isBadRequest());

        // Validate the Dermatologue in the database
        List<Dermatologue> dermatologueList = dermatologueRepository.findAll();
        assertThat(dermatologueList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllDermatologues() throws Exception {
        // Initialize the database
        dermatologueRepository.save(dermatologue);

        // Get all the dermatologueList
        restDermatologueMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dermatologue.getId())))
            .andExpect(jsonPath("$.[*].codeEmp").value(hasItem(DEFAULT_CODE_EMP)))
            .andExpect(jsonPath("$.[*].genre").value(hasItem(DEFAULT_GENRE)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)));
    }

    @Test
    void getDermatologue() throws Exception {
        // Initialize the database
        dermatologueRepository.save(dermatologue);

        // Get the dermatologue
        restDermatologueMockMvc
            .perform(get(ENTITY_API_URL_ID, dermatologue.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dermatologue.getId()))
            .andExpect(jsonPath("$.codeEmp").value(DEFAULT_CODE_EMP))
            .andExpect(jsonPath("$.genre").value(DEFAULT_GENRE))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE));
    }

    @Test
    void getNonExistingDermatologue() throws Exception {
        // Get the dermatologue
        restDermatologueMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingDermatologue() throws Exception {
        // Initialize the database
        dermatologueRepository.save(dermatologue);

        int databaseSizeBeforeUpdate = dermatologueRepository.findAll().size();

        // Update the dermatologue
        Dermatologue updatedDermatologue = dermatologueRepository.findById(dermatologue.getId()).orElseThrow();
        updatedDermatologue.codeEmp(UPDATED_CODE_EMP).genre(UPDATED_GENRE).telephone(UPDATED_TELEPHONE);

        restDermatologueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDermatologue.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDermatologue))
            )
            .andExpect(status().isOk());

        // Validate the Dermatologue in the database
        List<Dermatologue> dermatologueList = dermatologueRepository.findAll();
        assertThat(dermatologueList).hasSize(databaseSizeBeforeUpdate);
        Dermatologue testDermatologue = dermatologueList.get(dermatologueList.size() - 1);
        assertThat(testDermatologue.getCodeEmp()).isEqualTo(UPDATED_CODE_EMP);
        assertThat(testDermatologue.getGenre()).isEqualTo(UPDATED_GENRE);
        assertThat(testDermatologue.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
    }

    @Test
    void putNonExistingDermatologue() throws Exception {
        int databaseSizeBeforeUpdate = dermatologueRepository.findAll().size();
        dermatologue.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDermatologueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dermatologue.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dermatologue))
            )
            .andExpect(status().isBadRequest());

        // Validate the Dermatologue in the database
        List<Dermatologue> dermatologueList = dermatologueRepository.findAll();
        assertThat(dermatologueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchDermatologue() throws Exception {
        int databaseSizeBeforeUpdate = dermatologueRepository.findAll().size();
        dermatologue.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDermatologueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dermatologue))
            )
            .andExpect(status().isBadRequest());

        // Validate the Dermatologue in the database
        List<Dermatologue> dermatologueList = dermatologueRepository.findAll();
        assertThat(dermatologueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamDermatologue() throws Exception {
        int databaseSizeBeforeUpdate = dermatologueRepository.findAll().size();
        dermatologue.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDermatologueMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dermatologue)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Dermatologue in the database
        List<Dermatologue> dermatologueList = dermatologueRepository.findAll();
        assertThat(dermatologueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateDermatologueWithPatch() throws Exception {
        // Initialize the database
        dermatologueRepository.save(dermatologue);

        int databaseSizeBeforeUpdate = dermatologueRepository.findAll().size();

        // Update the dermatologue using partial update
        Dermatologue partialUpdatedDermatologue = new Dermatologue();
        partialUpdatedDermatologue.setId(dermatologue.getId());

        partialUpdatedDermatologue.genre(UPDATED_GENRE).telephone(UPDATED_TELEPHONE);

        restDermatologueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDermatologue.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDermatologue))
            )
            .andExpect(status().isOk());

        // Validate the Dermatologue in the database
        List<Dermatologue> dermatologueList = dermatologueRepository.findAll();
        assertThat(dermatologueList).hasSize(databaseSizeBeforeUpdate);
        Dermatologue testDermatologue = dermatologueList.get(dermatologueList.size() - 1);
        assertThat(testDermatologue.getCodeEmp()).isEqualTo(DEFAULT_CODE_EMP);
        assertThat(testDermatologue.getGenre()).isEqualTo(UPDATED_GENRE);
        assertThat(testDermatologue.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
    }

    @Test
    void fullUpdateDermatologueWithPatch() throws Exception {
        // Initialize the database
        dermatologueRepository.save(dermatologue);

        int databaseSizeBeforeUpdate = dermatologueRepository.findAll().size();

        // Update the dermatologue using partial update
        Dermatologue partialUpdatedDermatologue = new Dermatologue();
        partialUpdatedDermatologue.setId(dermatologue.getId());

        partialUpdatedDermatologue.codeEmp(UPDATED_CODE_EMP).genre(UPDATED_GENRE).telephone(UPDATED_TELEPHONE);

        restDermatologueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDermatologue.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDermatologue))
            )
            .andExpect(status().isOk());

        // Validate the Dermatologue in the database
        List<Dermatologue> dermatologueList = dermatologueRepository.findAll();
        assertThat(dermatologueList).hasSize(databaseSizeBeforeUpdate);
        Dermatologue testDermatologue = dermatologueList.get(dermatologueList.size() - 1);
        assertThat(testDermatologue.getCodeEmp()).isEqualTo(UPDATED_CODE_EMP);
        assertThat(testDermatologue.getGenre()).isEqualTo(UPDATED_GENRE);
        assertThat(testDermatologue.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
    }

    @Test
    void patchNonExistingDermatologue() throws Exception {
        int databaseSizeBeforeUpdate = dermatologueRepository.findAll().size();
        dermatologue.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDermatologueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, dermatologue.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dermatologue))
            )
            .andExpect(status().isBadRequest());

        // Validate the Dermatologue in the database
        List<Dermatologue> dermatologueList = dermatologueRepository.findAll();
        assertThat(dermatologueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchDermatologue() throws Exception {
        int databaseSizeBeforeUpdate = dermatologueRepository.findAll().size();
        dermatologue.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDermatologueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dermatologue))
            )
            .andExpect(status().isBadRequest());

        // Validate the Dermatologue in the database
        List<Dermatologue> dermatologueList = dermatologueRepository.findAll();
        assertThat(dermatologueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamDermatologue() throws Exception {
        int databaseSizeBeforeUpdate = dermatologueRepository.findAll().size();
        dermatologue.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDermatologueMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(dermatologue))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Dermatologue in the database
        List<Dermatologue> dermatologueList = dermatologueRepository.findAll();
        assertThat(dermatologueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteDermatologue() throws Exception {
        // Initialize the database
        dermatologueRepository.save(dermatologue);

        int databaseSizeBeforeDelete = dermatologueRepository.findAll().size();

        // Delete the dermatologue
        restDermatologueMockMvc
            .perform(delete(ENTITY_API_URL_ID, dermatologue.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Dermatologue> dermatologueList = dermatologueRepository.findAll();
        assertThat(dermatologueList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
